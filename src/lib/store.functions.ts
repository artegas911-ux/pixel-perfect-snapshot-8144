import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';
import { calculateTotals, type Product, type CartLine, type Order } from './store-model';

const lineSchema = z.object({ productId: z.string().max(80), size: z.string().max(20), quantity: z.number().int().min(1).max(99) });
const stateSchema = z.object({ cart: z.array(lineSchema).max(100), saved: z.array(z.string().max(80)).max(100) });
export const getProducts = createServerFn({ method: 'GET' }).handler(async (): Promise<Product[]> => {
 const key = process.env['SUPABASE_PUBLISHABLE_KEY']; const url = process.env['SUPABASE_URL'];
 if (!key || !url) throw new Error('The catalog is temporarily unavailable.');
 const client = createClient<Database>(url, key, { auth: { persistSession: false }, global: { fetch: (input, init) => {
  const headers = new Headers(init?.headers); if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
  headers.set('apikey', key); return fetch(input, { ...init, headers });
 } } });
 const { data, error } = await client.from('store_products').select('*');
 if (error) throw new Error('The catalog is temporarily unavailable.');
 const order = ['si-hoodie','moncler-maya','margiela-tee','cp-beanie'];
 return (data ?? []).sort((a,b) => { const ai = order.indexOf(a.id), bi = order.indexOf(b.id); return (ai < 0 ? 20 : ai) - (bi < 0 ? 20 : bi); });
});
export const getShoppingState = createServerFn({ method: 'POST' }).handler(async () => {
 const { shoppingSession } = await import('./store-session.server');
 const session = await shoppingSession();
 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 const { data, error } = await supabaseAdmin.from('store_orders').select('*').eq('session_id', session.id).order('created_at', { ascending: false });
 if (error) throw new Error('Your orders could not be loaded.');
 return { cart: z.array(lineSchema).parse(session.cart), saved: z.array(z.string()).parse(session.saved), orders: (data ?? []) as unknown as Order[] };
});
export const saveShoppingState = createServerFn({ method: 'POST' }).inputValidator(stateSchema).handler(async ({ data }) => {
 const { shoppingSession } = await import('./store-session.server'); const session = await shoppingSession();
 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 const { error } = await supabaseAdmin.from('store_sessions').update({ cart: data.cart, saved: data.saved }).eq('id', session.id);
 if (error) throw new Error('Your changes could not be saved. Please try again.');
 return { ok: true };
});
export const demoCheckout = createServerFn({ method: 'POST' }).inputValidator(z.object({ promo: z.string().max(30) })).handler(async ({ data }): Promise<Order> => {
 const { shoppingSession } = await import('./store-session.server'); const session = await shoppingSession();
 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 const cart: CartLine[] = z.array(lineSchema).parse(session.cart);
 if (!cart.length) throw new Error('Add a piece to your cart before checking out.');
 const { data: products, error: productError } = await supabaseAdmin.from('store_products').select('*').in('id', cart.map(i => i.productId));
 if (productError || !products) throw new Error('Unable to verify your cart.');
 const items = cart.map(line => {
  const product = products.find(p => p.id === line.productId);
  if (!product || !product.sizes.includes(line.size)) throw new Error('A selected item or size is unavailable.');
  return { ...line, name: product.name, brand: product.brand, price: product.price, photo: product.photo };
 });
 const totals = calculateTotals(cart, products, data.promo);
 const { data: order, error } = await supabaseAdmin.from('store_orders').insert({ session_id: session.id, items, total: totals.total, discount: totals.discount, shipping: totals.shipping, is_demo: true, status: 'Paid' }).select('*').single();
 if (error || !order) throw new Error('Your demo order could not be completed. Please try again.');
 const { error: clearError } = await supabaseAdmin.from('store_sessions').update({ cart: [] }).eq('id', session.id);
 if (clearError) throw new Error('Order placed, but your cart could not be cleared. Refresh before ordering again.');
 return order as unknown as Order;
});
export const advanceDemoOrder = createServerFn({ method: 'POST' }).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data }) => {
 const { shoppingSession } = await import('./store-session.server'); const session = await shoppingSession();
 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 const { data: order, error } = await supabaseAdmin.from('store_orders').select('status').eq('id', data.id).eq('session_id', session.id).single();
 if (error || !order) throw new Error('Order not found.');
 const status = order.status === 'Paid' ? 'Processing' : 'Shipped';
 const { error: updateError } = await supabaseAdmin.from('store_orders').update({ status }).eq('id', data.id).eq('session_id', session.id);
 if (updateError) throw new Error('Unable to update this demo order.');
 return { status };
});
