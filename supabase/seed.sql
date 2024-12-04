INSERT INTO "public"."blobs" ("id", "created_at", "user_id", "uuid", "title", "url", "notes", "rating")
VALUES ('1', '2024-10-26 15:05:32.916974+00', null, 'ea37d59d-540a-4f8e-9e53-d0c062856212', 'SQLite',
        'https://github.com/ViggieM/minimalistdjango/blob/main/tools/sqlite.md', null, '5'),
       ('2', '2024-10-29 19:49:48.418276+00', null, 'e14c2ee6-d2a7-46ef-bcb8-661a391901f3', 'Caching Data in SvelteKit',
        'https://css-tricks.com/caching-data-in-sveltekit/', null, null);
INSERT INTO "public"."blob_tags" ("created_at", "blob_id", "tag_id")
VALUES ('2024-11-15 15:04:24.203404+00', '1', '1'),
       ('2024-11-15 15:04:24.203404+00', '1', '4'),
       ('2024-11-15 15:04:24.203404+00', '1', '6'),
       ('2024-11-15 15:04:24.203404+00', '1', '16');
INSERT INTO "public"."tags" ("id", "created_at", "alternative_names", "parent_id", "name", "search_vector")
VALUES ('1', '2024-10-22 19:34:36.272805+00', '"{\"Dance\",\"Tanzen\"]}', null, 'Dancing', ''danc':1,2 'tanzen':3'),
       ('2', '2024-10-22 19:35:27.894017+00', null, '1', 'Salsa', ''salsa':1'),
       ('3', '2024-10-22 19:36:40.47038+00', '"{\"Dev\"]}', null, 'Software Development',
        ''dev':3 'develop':2 'softwar':1'),
       ('4', '2024-10-22 19:37:15.645547+00', '"{\"Datenbanken\"]}', '3', 'Databases', ''databas':1 'datenbanken':2'),
       ('5', '2024-10-22 20:38:00.917064+00', '"{\"Dile que no\",\"Cambio de lugar\",\"Cruce\"]}', '2',
        'Cross Body Lead', ''bodi':2 'cambio':7 'cross':1 'cruce':10 'de':8 'dile':4 'lead':3 'lugar':9 'que':5'),
       ('6', '2024-10-29 19:37:20.459948+00', null, '3', 'Performance', ''perform':1'),
       ('7', '2024-10-29 20:11:01.701892+00', null, '1', 'Hip Hop', ''hip':1 'hop':2'),
       ('8', '2024-11-10 14:43:10.966595+00', null, '4', 'SQLite', ''sqlite':1'),
       ('9', '2024-11-10 15:55:35.399996+00', null, '2', 'Outside Turn', ''outsid':1 'turn':2'),
       ('10', '2024-11-10 15:55:55.211148+00', null, '2', 'Hammer Lock', ''hammer':1 'lock':2'),
       ('16', '2024-11-15 10:39:22.828041+00', null, '3', 'CSS', ''css':1'),
       ('17', '2024-11-19 20:20:37.190407+00', null, null, 'HTML', ''html':1');
