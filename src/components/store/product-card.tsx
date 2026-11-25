import { useState } from 'react';
import { Heart, Plus, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Product, euro } from '@/lib/store-model';
import { productImages } from './product-images';
export function ProductCard({ product, saved, ready, onSave, onAdd, onDetails }: { product: Product; saved: boolean; ready: boolean; onSave: () => void; onAdd: (size: string) => void; onDetails: () => void }) {
 const [size, setSize] = useState(product.sizes[0] ?? 'M');
 return <article className="product-card">
  <div className="product-photo">
   <img src={productImages[product.photo]} alt={`${product.brand} ${product.name} — illustrative studio photo`} loading="lazy" />
   <Button variant="ghost" size="icon" className="icon-on-photo absolute right-3 top-3 h-8 w-8" aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name}`} title="Save to selected items" disabled={!ready} onClick={onSave}><Heart className={saved ? 'fill-current' : ''} /></Button>
   <Button variant="ghost" size="icon" className="icon-on-photo absolute bottom-3 right-3 h-7 w-7" aria-label={`Description & Specs for ${product.name}`} title="Description & Specs" onClick={onDetails}><ArrowUpRight /></Button>
   {product.id === 'si-hoodie' && <span className="absolute left-3 top-3 rounded bg-primary px-2 py-1 text-[9px] font-semibold text-primary-foreground">THE EDIT</span>}
  </div>
  <div className="mt-4 flex items-start justify-between gap-2"><p className="product-brand">{product.brand}</p><span className="text-xs font-medium">{euro(product.price)}</span></div>
  <h3 className="mt-1 min-h-9 text-muted-foreground">{product.name}</h3>
  <div className="mt-2 flex gap-2"><select className="store-select w-16 shrink-0" aria-label={`Size for ${product.name}`} value={size} onChange={e => setSize(e.target.value)}>{product.sizes.map(s => <option key={s}>{s}</option>)}</select><Button className="store-button h-[34px] flex-1 px-2 text-[10px]" disabled={!ready} onClick={() => onAdd(size)}><Plus className="!size-3" />Add to cart</Button></div>
 </article>;
}
