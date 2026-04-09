ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_user_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS users_auth_user_id_unique ON public.users (auth_user_id) WHERE auth_user_id IS NOT NULL;

COMMENT ON COLUMN public.users.auth_user_id IS 'Maps to auth.users(id) on Supabase. Required for RLS policies using auth.uid(). Backfill existing rows before relying on client-side Supabase Data API.';

DO $rls_fk$
BEGIN
  ALTER TABLE public.users
    ADD CONSTRAINT users_auth_user_id_fkey
    FOREIGN KEY (auth_user_id) REFERENCES auth.users (id) ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_table THEN NULL;
END $rls_fk$;
