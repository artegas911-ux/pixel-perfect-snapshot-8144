import { getCookie, setCookie, getRequest } from '@tanstack/react-start/server';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export async function shoppingSession() {
 let secret = getCookie('maison_session');
 if (!secret || !/^[a-f0-9]{64}$/.test(secret)) {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  secret = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  setCookie('maison_session', secret, { httpOnly: true, secure: new URL(getRequest().url).protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
 }
 const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
 const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
 const { data: found, error } = await supabaseAdmin.from('store_sessions').select('*').eq('secret_hash', hash).maybeSingle();
 if (error) throw new Error('Your shopping session could not be loaded. Please try again.');
 if (found) return found;
 const { data, error: createError } = await supabaseAdmin.from('store_sessions').insert({ secret_hash: hash }).select('*').single();
 if (createError || !data) throw new Error('Your shopping session could not be created. Please try again.');
 return data;
}
