import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/store.functions";
import { Store } from "@/components/store/store";
const catalogQuery = queryOptions({ queryKey: ['store-products'], queryFn: () => getProducts(), staleTime: 60000 });
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'MAISON STORE — Designer Streetwear & The Winter Edit' },
    { name: 'description', content: 'Explore a considered selection of luxury designer streetwear from Stone Island, Moncler, Dior, C.P. Company and more. MAISON STORE demo boutique.' },
    { property: 'og:title', content: 'MAISON STORE — The Winter Edit' },
    { property: 'og:description', content: 'Quiet confidence. Uncompromising style. Discover the MAISON STORE designer streetwear selection.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: Index,
});
function Index() {
  const { data } = useSuspenseQuery(catalogQuery);
  return <Store products={data} />;
}
