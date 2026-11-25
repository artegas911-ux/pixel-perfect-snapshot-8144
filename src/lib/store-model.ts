export type Product = { id: string; brand: string; name: string; category: string; price: number; photo: number; sizes: string[]; fabric: string; fit: string; care: string };
export type CartLine = { productId: string; size: string; quantity: number };
export type Order = { id: string; items: (CartLine & { name: string; brand: string; price: number; photo: number })[]; total: number; discount: number; shipping: number; status: string; is_demo: boolean; created_at: string };
export const categories = ['All', 'Bags', 'Jackets', 'Beanies / Hats', 'Neck Gaiters / Buffs', 'Sweaters / Zip-ups', 'T-Shirts', 'Hoodies'];
export const brands = ['Dior', 'Guess', 'Stone Island', 'C.P. Company', 'Adidas', 'Lacoste', 'Maison Margiela', 'Puma', 'Moncler'];
export const euro = (cents: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
export function calculateTotals(cart: CartLine[], products: Product[], promo: string) {
 const subtotal = cart.reduce((sum, line) => sum + (products.find(p => p.id === line.productId)?.price ?? 0) * line.quantity, 0);
 const discount = promo.trim().toUpperCase() === 'VIP15' ? Math.round(subtotal * 0.15) : 0;
 const shipping = subtotal === 0 || subtotal >= 25000 ? 0 : 1000;
 return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
export function addCartLine(cart: CartLine[], line: CartLine) {
 const existing = cart.find(item => item.productId === line.productId && item.size === line.size);
 return existing ? cart.map(item => item === existing ? { ...item, quantity: item.quantity + line.quantity } : item) : [...cart, line];
}
