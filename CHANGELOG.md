## Set up Google Authentication

- Anleitung auf https://supabase.com/docs/guides/auth/social-login/auth-google folgen
- on https://console.cloud.google.com/apis/credentials/consent/edit;newAppInternalUser=false?project=wherehowhy-1541494745810
  - kein Anwendungslogo angegeben
  - supabase projekt erstellen und domain zu Authorizierte domains hinzufügen
- deployen auf netlify: https://app.netlify.com/sites/splendid-hummingbird-a9d52f/overview
  - URL: https://splendid-hummingbird-a9d52f.netlify.app/
- [Svelte docs](https://svelte.dev/docs/introduction)
- [SvelteKit docs](https://kit.svelte.dev/docs/introduction)
- [GitHub project](https://github.com/ViggieM/my-links)
- dotenvx nicht notwendig, da vite von selbst env variablen liest https://vite.dev/guide/env-and-mode.html#env-files
  - vite wird keine env variablen zum client leaken die nicht mit `VITE_` geprefixed sind
- ich setze zunächst ein projekt mit sveltekit auf nach dieser Anleitung: https://supabase.com/docs/guides/auth/server-side/sveltekit
  - error code `email_address_not_authorized`: Das Problem ist dass Supabase SMTP service nur an definierten email adressen emails verschickt https://supabase.com/docs/guides/auth/auth-smtp
    außer man konfiguriert einen eigenen SMTP server
  - sendgrid lässt mich keine API key einrichten?
    - doch, es erstellt es: https://app.sendgrid.com/settings/api_keys aber ich kann es scheinbar nicht verwenden. Das sollte ich nochmal mit python testen eventuell
