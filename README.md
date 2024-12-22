# Blobs

- Netlify Dashboard: https://app.netlify.com/sites/splendid-hummingbird-a9d52f/overview
- Netlify App url: https://splendid-hummingbird-a9d52f.netlify.app/

## Local Development

```bash
pnpx supabase start
pnpm run dev
```

## Learnings

### Server side Authentication with SvelteKit

Followed Supabase's docs on this: https://supabase.com/docs/guides/auth/server-side/sveltekit.

### Social Authentication with Supabase

Followed the instructions in [Supabase Docs](https://supabase.com/docs/guides/auth/social-login/auth-google).
I chose the option for Application code configuration, since it is more general, even though I would have probably been fine with Google's OneTap flow.

[Custom domain](https://supabase.com/docs/guides/platform/custom-domains) is only available on paid plan, but is only for authentication window.
I could still host on my domain, by pointing the DNS to the Netlify app.

#### Troubleshooting

- error code `email_address_not_authorized`: Supabase's SMTP service only allows to send emails to predefined recipients, see https://supabase.com/docs/guides/auth/auth-smtp.
  This can be avoided if a private SMTP server is configured
- Authentication flow does not complete: [Redirect URLs](https://supabase.com/dashboard/project/kmhjxwhamrskryebsqbm/auth/url-configuration) require a trailing slash, e.g.:
  - `https://*.minimalistdjango.com/`
  - `https://*links-minimalistdjango.netlify.app/`

### Deployment on Netlify

### Postgres

#### Search tags

Searching tags works by creating an extra column 'search_vector' that contains a combination of a tag's name and alternative names.

```sql
ALTER TABLE public.tags ADD COLUMN search_vector tsvector;
```

I defined a function (in the supabase dashboard) that populates the value of the search_vector column by combining the 'name' and 'alternative_names' columns.

```sql
BEGIN
    NEW.search_vector := to_tsvector(
        'english',
        coalesce(NEW.name, '') || ' ' ||
        coalesce(array_to_string(NEW.alternative_names, ' '), '')
    );
    RETURN NEW;
END;
```

Then I set up a trigger so that every time a row is updated or inserted, the value of the 'search_vector' column is updated.
To populate existing rows, I had to trigger an update by setting the row to the same name as before.

```sql
DO $$
DECLARE
    record_id INTEGER; -- Variable to hold the id
BEGIN
    FOR record_id IN SELECT id FROM public.tags LOOP
        UPDATE public.tags SET name = name WHERE id = record_id;
    END LOOP;
END $$;
```

Searching works, but it's important to search by prefix, otherwise there will be no suggestions while typing.
Therefore, I declared a function 'search_tags_by_prefix', as described in [Full Text Search | Supabase Docs](https://supabase.com/docs/guides/database/full-text-search)

```sql
create or replace function search_tags_by_prefix(prefix text)
returns setof tags AS $$
begin
  return query
  select * from tags where search_vector @@ to_tsquery(prefix || ':*');
end;
$$ language plpgsql;
```

### Supabase

```bash
# pull the docker images locally
pnpx supabase start
# in case you forget the local credentials, you can display them again with this command
pnpx supabase status
# to link a local project to an existing supabase instance
pnpx supabase link
# to create an initial migration from the existing supabase instance
pnpx supabase db diff -f initial_structure --linked
# to create a dump from your local data
pnpx supabase db dump --data-only -f supabase/seed.sql
# apply changes locally
pnpx supabase db reset
# apply changes to remote supabase instance
pnpx supabase db push --linked
```

#### Set up authentication locally

Reference: [How to setup supabase locally with OAUTH providers | Alberto Sadde](https://www.albertosadde.com/blog/local-auth-with-subapase/)

#### Troubleshooting

- `pnpx supabase db push --linked` fails with "must be owner of table ...": see [cli - supabase db push as postgres user causes "ERROR: must be owner of table" · supabase · Discussion #6326](https://github.com/orgs/supabase/discussions/6326)

### Misc

- `dotenvx` is not necessary, since vite reads the env variables on its own, see https://vite.dev/guide/env-and-mode.html#env-files .
  Worth remembering that vite will never leak env variables that are prefixed with `VITE_` to the client.
- specifying the [adapter](https://kit.svelte.dev/docs/adapter-auto) for Svelte ("adapter-netlify" instead of "adapter-auto") improves build time

## References

- [Svelte docs](https://svelte.dev/docs/introduction)
- [SvelteKit docs](https://kit.svelte.dev/docs/introduction)
- [Setting up Server-Side Auth for SvelteKit | Supabase Docs](https://supabase.com/docs/guides/auth/server-side/sveltekit)
- [Build a User Management App with SvelteKit | Supabase Docs](https://supabase.com/docs/guides/getting-started/tutorials/with-sveltekit) (more tutorials)
- [Full Text Search | Supabase Docs](https://supabase.com/docs/guides/database/full-text-search)
- [PostgreSQL: Documentation: 17: 12.3. Controlling Text Search](https://www.postgresql.org/docs/current/textsearch-controls.html)
