import { CONFIG } from 'src/admin/config-global';

import { SignInView } from 'src/admin/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign in - ${CONFIG.appName}`}</title>

      <SignInView />
    </>
  );
}
