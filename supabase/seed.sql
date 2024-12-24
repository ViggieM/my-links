SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


INSERT INTO "public"."blobs" ("id", "created_at", "user_id", "uuid", "title", "url", "notes", "rating") VALUES
	(1, '2024-12-24 15:32:56.231495+00', 'b3ea98e4-b696-4684-aae6-045e510af684', '3a8a91fb-e877-4f8c-b02a-e32e6e2efdfa', 'Svelte MultiSelect', 'https://multiselect.janosh.dev/', '', 5),
	(2, '2024-12-24 15:35:53.218613+00', 'b3ea98e4-b696-4684-aae6-045e510af684', '94938dea-cf4d-4340-a60c-8e80cc3a7861', 'daisyUI', 'https://daisyui.com/', '', 5),
	(3, '2024-12-24 15:37:58.375367+00', 'b3ea98e4-b696-4684-aae6-045e510af684', 'c7ede348-8a5c-4247-b498-90368e02ea84', 'SvelteKit (Svelte 5) and Supabase', 'https://www.thespatula.io/svelte/sveltekit_supabase/', '', 0);


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tags" ("id", "created_at", "alternative_names", "parent_id", "name", "search_vector", "color") VALUES
	(1, '2024-12-24 15:33:06.562725+00', NULL, NULL, 'Svelte', '''svelt'':1', NULL),
	(2, '2024-12-24 15:34:37.222754+00', NULL, NULL, 'JavaScript', '''javascript'':1', NULL),
	(3, '2024-12-24 15:36:03.364025+00', NULL, NULL, 'TailwindCSS', '''tailwindcss'':1', NULL),
	(4, '2024-12-24 15:38:13.308112+00', NULL, NULL, 'Supabase', '''supabas'':1', NULL),
	(5, '2024-12-24 15:38:40.872356+00', NULL, NULL, '@read/review', '''read/review'':1', NULL);


--
-- Data for Name: blob_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."blob_tags" ("created_at", "blob_id", "tag_id") VALUES
	('2024-12-24 15:34:37.269127+00', 1, 1),
	('2024-12-24 15:34:37.269127+00', 1, 2),
	('2024-12-24 15:36:03.397021+00', 2, 3),
	('2024-12-24 15:38:40.909268+00', 3, 1),
	('2024-12-24 15:38:40.909268+00', 3, 4),
	('2024-12-24 15:38:40.909268+00', 3, 5);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: blobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."blobs_id_seq"', 3, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tags_id_seq"', 5, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
