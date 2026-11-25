import { describe, it, expect } from 'vitest';
import { calculateTotals, addCartLine, type Product } from '@/lib/store-model';
const product: Product = { id: 'hoodie', brand: 'Stone Island', name: 'Hoodie', price: 34500, category: 'Hoodies', photo: 0, sizes: ['S','M','L','XL'], fabric: 'Cotton', fit: 'Regular', care: 'Cold wash' };
describe('Store shopping rules', () => {
 it('VIP15 takes exactly 15 percent off merchandise', () => { expect(calculateTotals([{ productId: 'hoodie', size: 'M', quantity: 1 }], [product], 'VIP15').discount).toBe(5175); });
 it('merges the same piece and size into one quantity', () => { expect(addCartLine([{ productId:'hoodie', size:'M',quantity:1 }], { productId:'hoodie',size:'M',quantity:1 })).toEqual([{ productId:'hoodie',size:'M',quantity:2 }]); });
 it('keeps different sizes separate', () => { expect(addCartLine([{ productId:'hoodie',size:'M',quantity:1 }], { productId:'hoodie',size:'L',quantity:1 })).toHaveLength(2); });
 it('charges ten euros shipping below 250 euros', () => { expect(calculateTotals([{ productId:'hoodie',size:'M',quantity:1 }],[{...product,price:10000}],'').shipping).toBe(1000); });
 it('shipping is free at 250 euros', () => { expect(calculateTotals([{ productId:'hoodie',size:'M',quantity:1 }],[{...product,price:25000}],'').shipping).toBe(0); });
});
