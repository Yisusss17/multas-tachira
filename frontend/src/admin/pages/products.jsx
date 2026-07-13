import { CONFIG } from 'src/admin/config-global';

import { ProductsView } from 'src/admin/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>

      <ProductsView />
    </>
  );
}
