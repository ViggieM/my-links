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

## Netlify deployment

- ich könnte auch netlify einrichten dass sich user über oauth authentifizieren
  - https://app.netlify.com/sites/splendid-hummingbird-a9d52f/configuration/access#oauth
- https://kit.svelte.dev/docs/adapter-auto funktioniert für netlify automatisch, wäre aber gut zu ändern auf @sveltejs/adapter-netlify for Netlify
- Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and many not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
- das problem war dass ich in supabase die redirect url konfigurieren musste: https://supabase.com/dashboard/project/kmhjxwhamrskryebsqbm/auth/url-configuration

### custom domains

- kann ich nicht machen, da es nicht im free plan ist https://supabase.com/docs/guides/platform/custom-domains
  - aber ich kann die seite auf links.minimalistdjango.com hosten
- DNS record muss hinzugefügt werden
- https://supabase.com/dashboard/project/kmhjxwhamrskryebsqbm/auth/url-configuration URL muss hinzugefügt werden
- GGF Datenschutzerklärung und Nutzungsbedingungen sollten entsprechend angepasst werden
- Beim Hinzufügen von domains unter https://supabase.com/dashboard/project/kmhjxwhamrskryebsqbm/auth/url-configuration muss man darauf achten dass der `/` am ende da ist
  - `https://*.minimalistdjango.com/`
  - `https://*links-minimalistdjango.netlify.app`
    - erlaubt auch test subdomains sich zu registrieren

## Bucket upload

- ein bucket erstellt, und permissions auf ein ordner gegeben für alle authentifizierten user. hat soweit gepasst, ich habe nur nicht den initialisierten supabase client verwendet, deshalb war ich nicht authentifiziert.
  und die mehr restrictive policy hätte es wohlmöglich auch getan
-

## Planung tabellen

- Eine Tabelle für Blobs
  - nur ich kann Elemente hinzufügen
  - andere user können nur sehen, wenn die items einen bestimmten Tag haben
    - z.B. minimalistdjango für alle
    - Salsa/tanzen nur für bestimmte User
      - auch sub tags von einem tag muss beachtet werden
    - alle anderen kann nur ich sehen
  - Es kann nur eine mediendatei hochgeladen werden pro blob. Das liegt daran dass es unwahrscheinlich ist dass man zwei hochladen muss, und KISS
- Eine Tabelle für Tags
  - id, name und parent_id
- Eine Tabelle für Tags und user uuid
  - damit kann man sicherstellen wer welche tags sehen darf
  - nicht alle tags dürfen für alle user sichtbar sein
- Erstmal keine Verbindungen zwischen Blobs

## Fehler

Folgender Fehler taucht in den server logs ständig auf

```
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and many not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
```

es scheint untersucht zu sein [hier](https://github.com/supabase/auth-js/issues/873) und [das](https://github.com/supabase/auth-js/issues/873#issuecomment-2081467385) ist evtl eine Lösung.

## Sveltekit

- Mehr demos https://supabase.com/docs/guides/getting-started/tutorials/with-sveltekit
- Man kann Datenbank schema pullen lokal:https://supabase.com/docs/guides/local-development/overview#link-your-project
- https://chatgpt.com/c/671d4677-dafc-8006-8a54-dc26b4b5c668

# Svelte 5

- details zu supabase auth https://www.thespatula.io/svelte/sveltekit_supabase/
- svelte 4 docs https://v4.svelte.dev/docs/svelte-store

# Supabase functions

Docs:

- [Full Text Search | Supabase Docs](https://supabase.com/docs/guides/database/full-text-search)
- [PostgreSQL: Documentation: 17: 12.3. Controlling Text Search](https://www.postgresql.org/docs/current/textsearch-controls.html)

```sql
CREATE
OR REPLACE FUNCTION get_parent_tags_multiple (tag_ids BIGINT[]) RETURNS TABLE (id BIGINT, NAME TEXT, parent_id SMALLINT) AS $$
WITH RECURSIVE parent_tags AS (
    SELECT
        id,
        name,
        parent_id
    FROM
        public.tags
    WHERE
        id = ANY(tag_ids)  -- Start with the tags having the specified ids

    UNION ALL

    SELECT
        t.id,
        t.name,
        t.parent_id
    FROM
        public.tags t
    INNER JOIN
        parent_tags pt ON t.id = pt.parent_id  -- Join to find parent tags
)
SELECT
    id,
    name,
    parent_id
FROM
    parent_tags;
$$ LANGUAGE SQL;
```

```sql
CREATE
OR REPLACE FUNCTION get_parent_tags_and_siblings (tag_ids BIGINT[]) RETURNS TABLE (id BIGINT, NAME TEXT, parent_id SMALLINT) AS $$
WITH RECURSIVE
  parent_tags AS (
    SELECT
      id,
      NAME,
      parent_id
    FROM
      public.tags
    WHERE
      id = ANY (tag_ids) -- Replace with your list of integers
    UNION ALL
    SELECT
      t.id,
      t.name,
      t.parent_id
    FROM
      public.tags t
      INNER JOIN parent_tags pt ON t.id = pt.parent_id
  ),
  siblings AS (
    SELECT
      t.id,
      t.name,
      t.parent_id
    FROM
      public.tags t
      INNER JOIN parent_tags pt ON t.parent_id = pt.parent_id
    WHERE
      t.id <> pt.id -- Exclude the tag itself
  )
SELECT
  id,
  NAME,
  parent_id
FROM
  parent_tags
UNION
SELECT
  id,
  NAME,
  parent_id
FROM
  siblings;
$$ LANGUAGE SQL;
```

# triggers and functions

Spalte erstellen

```sql
ALTER

TABLE
 public.tags
ADD

COLUMN
 search_vector tsvector;
```

Funktion definieren

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

Funktion wird getriggert bei BEFORE INSERT und BEFORE UPDATE

Um bestehende rows zu updaten, folgende query ausführen:

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

Suche nach prefix notwendig, sonst keine vorschläge, wenn man wörter eintippt:

```sql
create or replace function search_tags_by_prefix(prefix text)
returns setof tags AS $$
begin
  return query
  select * from tags where search_vector @@ to_tsquery(prefix || ':*');
end;
$$ language plpgsql;

```
