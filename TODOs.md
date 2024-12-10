# TODO

- [ ] Add a logo in [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent/edit;newAppInternalUser=false?project=wherehowhy-1541494745810)
- [ ] Configure SMTP server. Sendgrid allowed me to create an api key, but I couldn't use it https://app.sendgrid.com/settings/api_keys. Might want to test it with python first
- [ ] Fix Warning:
  ```
  Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and many not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
  ```
  Possible Solutions:
  - https://github.com/supabase/auth-js/issues/873
  - https://github.com/supabase/auth-js/issues/873#issuecomment-2081467385
- [ ] Save supabase schema locally, see https://supabase.com/docs/guides/local-development/overview#link-your-project

# Read/Review

- [ ] Read/review: [the spatula](https://www.thespatula.io/svelte/sveltekit_supabase/)
- [ ] [How to have Perfect Contrast of Text Color on Any Background in TailwindCSS - DEV Community](https://dev.to/didof/how-to-have-perfect-contrast-of-text-color-on-any-background-in-tailwindcss-4cbh)
- [ ] Research: Configure Netlify for OAuth https://app.netlify.com/sites/splendid-hummingbird-a9d52f/configuration/access#oauth
- [Applying dynamic styles with Tailwind CSS - LogRocket Blog](https://blog.logrocket.com/applying-dynamic-styles-tailwind-css/)
