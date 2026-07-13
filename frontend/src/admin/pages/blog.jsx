import { _posts } from 'src/admin/_mock';
import { CONFIG } from 'src/admin/config-global';

import { BlogView } from 'src/admin/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Blog - ${CONFIG.appName}`}</title>

      <BlogView posts={_posts} />
    </>
  );
}
