CREATE TABLE public.store_products (id text PRIMARY KEY, brand text NOT NULL, name text NOT NULL, category text NOT NULL, price integer NOT NULL CHECK(price>0), photo integer NOT NULL, sizes text[] NOT NULL, fabric text NOT NULL, fit text NOT NULL, care text NOT NULL);
GRANT SELECT ON public.store_products TO anon, authenticated;
GRANT ALL ON public.store_products TO service_role;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public catalog" ON public.store_products FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.store_sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), secret_hash text UNIQUE NOT NULL, cart jsonb NOT NULL DEFAULT '[]', saved jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.store_sessions TO service_role;
ALTER TABLE public.store_sessions ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.store_orders (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), session_id uuid NOT NULL REFERENCES public.store_sessions(id), items jsonb NOT NULL, total integer NOT NULL, discount integer NOT NULL DEFAULT 0, shipping integer NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'Paid' CHECK (status IN ('Paid','Processing','Shipped')), is_demo boolean NOT NULL DEFAULT true CHECK (is_demo = true), created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.store_orders TO service_role;
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX store_orders_session_idx ON public.store_orders(session_id);
INSERT INTO public.store_products (id,brand,name,category,price,photo,sizes,fabric,fit,care) VALUES
('si-hoodie','Stone Island','Compass Badge Hoodie','Hoodies',34500,0,ARRAY['S','M','L','XL'],'100% garment-dyed cotton fleece','Regular fit. Ribbed cuffs and hem.','Machine wash at 30°C; remove badge before washing.'),
('moncler-maya','Moncler','Maya Down Jacket','Jackets',149000,1,ARRAY['S','M','L','XL'],'100% polyamide; 90% down, 10% feather filling','Regular fit with detachable hood.','Professional specialist cleaning only.'),
('margiela-tee','Maison Margiela','Four-Stitch Cotton Tee','T-Shirts',24500,2,ARRAY['S','M','L','XL'],'100% organic cotton jersey','Relaxed fit with signature back stitching.','Gentle machine wash at 30°C.'),
('cp-beanie','C.P. Company','Goggle Knit Beanie','Beanies / Hats',12500,3,ARRAY['One Size'],'100% merino wool','Ribbed knit with signature goggle detail.','Hand wash cold; dry flat.'),
('dior-saddle','Dior','Saddle Crossbody Bag','Bags',210000,4,ARRAY['One Size'],'Grained calfskin leather; textile lining','Adjustable strap; 23 × 18 × 5 cm.','Wipe with a soft dry cloth; store in dust bag.'),
('lacoste-track','Lacoste','Heritage Track Jacket','Jackets',18500,5,ARRAY['S','M','L','XL'],'58% recycled polyester, 42% cotton','Regular fit with stand collar.','Machine wash at 30°C.'),
('puma-crew','Puma','Archive Crewneck','Sweaters / Zip-ups',8500,6,ARRAY['S','M','L','XL'],'80% cotton, 20% polyester','Relaxed fit with brushed fleece lining.','Machine wash at 30°C inside out.'),
('adidas-buff','Adidas','Originals Neck Gaiter','Neck Gaiters / Buffs',3500,7,ARRAY['One Size'],'88% recycled polyester, 12% elastane','Stretch fit; lightweight and breathable.','Machine wash cold; air dry.'),
('guess-puffer','Guess','Essential Puffer Jacket','Jackets',22900,1,ARRAY['S','M','L','XL'],'100% polyester shell; synthetic insulation','Regular fit with zip pockets.','Gentle wash at 30°C.'),
('si-sweater','Stone Island','Cotton Fleece Crewneck','Sweaters / Zip-ups',27500,6,ARRAY['S','M','L','XL'],'100% cotton fleece','Regular fit; garment-dyed finish.','Wash at 30°C; remove badge.'),
('moncler-beanie','Moncler','Wool Logo Beanie','Beanies / Hats',21000,3,ARRAY['One Size'],'100% virgin wool','Soft ribbed knit with folded brim.','Hand wash cold; dry flat.'),
('cp-hoodie','C.P. Company','Diagonal Fleece Hoodie','Hoodies',29500,0,ARRAY['S','M','L','XL'],'100% cotton diagonal fleece','Regular fit with adjustable hood.','Machine wash at 30°C inside out.'),
('dior-tee','Dior','Essential Cotton T-Shirt','T-Shirts',65000,2,ARRAY['S','M','L','XL'],'100% cotton jersey','Regular fit with ribbed crew neck.','Gentle machine wash at 30°C.'),
('guess-bag','Guess','Noelle Mini Shoulder Bag','Bags',13900,4,ARRAY['One Size'],'Polyurethane exterior; polyester lining','Compact silhouette with adjustable strap.','Wipe clean with a damp cloth.'),
('adidas-track','Adidas','Adicolor Track Top','Sweaters / Zip-ups',9000,5,ARRAY['S','M','L','XL'],'100% recycled polyester tricot','Regular fit; full zip and stand collar.','Machine wash cold.'),
('lacoste-tee','Lacoste','Classic Cotton Tee','T-Shirts',7500,2,ARRAY['S','M','L','XL'],'100% cotton jersey','Classic fit with crew neck.','Machine wash at 30°C.'),
('margiela-hoodie','Maison Margiela','Four-Stitch Hoodie','Hoodies',59000,0,ARRAY['S','M','L','XL'],'100% cotton loopback jersey','Oversized fit with dropped shoulders.','Machine wash cold inside out.'),
('puma-buff','Puma','Performance Neck Warmer','Neck Gaiters / Buffs',2800,7,ARRAY['One Size'],'92% polyester, 8% elastane','Lightweight stretch fit.','Machine wash at 30°C.');