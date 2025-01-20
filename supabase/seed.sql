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


INSERT INTO "public"."groups" ("name") VALUES
 ('Admin');

INSERT INTO "public"."permissions" ("name") VALUES
  ('all blob_tags'),
  ('all blobs'),
  ('all tags');

INSERT INTO "public".group_permissions ("group_id", "permission_id") VALUES
  (1, 1),
  (1, 2),
  (1, 3);
