DO $check$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    RAISE EXCEPTION 'Migration 0017_rls_policies.sql requires the PostgreSQL role "authenticated" (present on Supabase). For local Postgres without it, skip this file or create: CREATE ROLE authenticated NOINHERIT;';
  END IF;
END $check$;

CREATE SCHEMA IF NOT EXISTS private;

GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.coach_user_id()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  SELECT u.id
  FROM public.users u
  WHERE u.auth_user_id = auth.uid()
    AND u.deleted_at IS NULL
  LIMIT 1;
$fn$;

CREATE OR REPLACE FUNCTION private.coach_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  SELECT u.email
  FROM public.users u
  WHERE u.auth_user_id = auth.uid()
    AND u.deleted_at IS NULL
  LIMIT 1;
$fn$;

REVOKE ALL ON FUNCTION private.coach_user_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.coach_user_id() TO authenticated;

REVOKE ALL ON FUNCTION private.coach_user_email() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.coach_user_email() TO authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select_self_and_teammates ON public.users;
CREATE POLICY users_select_self_and_teammates
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    id = private.coach_user_id()
    OR EXISTS (
      SELECT 1
      FROM public.team_members tm_self
      INNER JOIN public.team_members tm_peer ON tm_self.team_id = tm_peer.team_id
      WHERE tm_self.user_id = private.coach_user_id()
        AND tm_peer.user_id = users.id
    )
  );

DROP POLICY IF EXISTS users_update_self ON public.users;
CREATE POLICY users_update_self
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = private.coach_user_id())
  WITH CHECK (id = private.coach_user_id());

DROP POLICY IF EXISTS users_no_insert ON public.users;
CREATE POLICY users_no_insert
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS users_no_delete ON public.users;
CREATE POLICY users_no_delete
  ON public.users
  FOR DELETE
  TO authenticated
  USING (false);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS teams_select_members ON public.teams;
CREATE POLICY teams_select_members
  ON public.teams
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.team_members tm
      WHERE tm.team_id = teams.id
        AND tm.user_id = private.coach_user_id()
    )
  );

DROP POLICY IF EXISTS teams_no_insert ON public.teams;
CREATE POLICY teams_no_insert
  ON public.teams
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS teams_no_update ON public.teams;
CREATE POLICY teams_no_update
  ON public.teams
  FOR UPDATE
  TO authenticated
  USING (false);

DROP POLICY IF EXISTS teams_no_delete ON public.teams;
CREATE POLICY teams_no_delete
  ON public.teams
  FOR DELETE
  TO authenticated
  USING (false);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS team_members_select_same_team ON public.team_members;
CREATE POLICY team_members_select_same_team
  ON public.team_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
        AND tm.user_id = private.coach_user_id()
    )
  );

DROP POLICY IF EXISTS team_members_no_insert ON public.team_members;
CREATE POLICY team_members_no_insert
  ON public.team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS team_members_delete_owner_other_members ON public.team_members;
CREATE POLICY team_members_delete_owner_other_members
  ON public.team_members
  FOR DELETE
  TO authenticated
  USING (
    team_members.user_id <> private.coach_user_id()
    AND EXISTS (
      SELECT 1
      FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
        AND tm.user_id = private.coach_user_id()
        AND tm.role = 'owner'
    )
  );

DROP POLICY IF EXISTS team_members_no_update ON public.team_members;
CREATE POLICY team_members_no_update
  ON public.team_members
  FOR UPDATE
  TO authenticated
  USING (false);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS invitations_select_team_or_invitee ON public.invitations;
CREATE POLICY invitations_select_team_or_invitee
  ON public.invitations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.team_members tm
      WHERE tm.team_id = invitations.team_id
        AND tm.user_id = private.coach_user_id()
    )
    OR lower(invitations.email) = lower(private.coach_user_email())
  );

DROP POLICY IF EXISTS invitations_insert_team_member ON public.invitations;
CREATE POLICY invitations_insert_team_member
  ON public.invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.team_members tm
      WHERE tm.team_id = invitations.team_id
        AND tm.user_id = private.coach_user_id()
    )
    AND invited_by = private.coach_user_id()
  );

DROP POLICY IF EXISTS invitations_update_team_or_accept ON public.invitations;
CREATE POLICY invitations_update_team_or_accept
  ON public.invitations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.team_members tm
      WHERE tm.team_id = invitations.team_id
        AND tm.user_id = private.coach_user_id()
    )
    OR (
      lower(invitations.email) = lower(private.coach_user_email())
      AND status = 'pending'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.team_members tm
      WHERE tm.team_id = invitations.team_id
        AND tm.user_id = private.coach_user_id()
    )
    OR lower(invitations.email) = lower(private.coach_user_email())
  );

DROP POLICY IF EXISTS invitations_no_delete ON public.invitations;
CREATE POLICY invitations_no_delete
  ON public.invitations
  FOR DELETE
  TO authenticated
  USING (false);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS activity_logs_select_own ON public.activity_logs;
CREATE POLICY activity_logs_select_own
  ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = private.coach_user_id());

DROP POLICY IF EXISTS activity_logs_insert_own_team ON public.activity_logs;
CREATE POLICY activity_logs_insert_own_team
  ON public.activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = private.coach_user_id()
    AND EXISTS (
      SELECT 1
      FROM public.team_members tm
      WHERE tm.team_id = activity_logs.team_id
        AND tm.user_id = private.coach_user_id()
    )
  );

DROP POLICY IF EXISTS activity_logs_no_update ON public.activity_logs;
CREATE POLICY activity_logs_no_update
  ON public.activity_logs
  FOR UPDATE
  TO authenticated
  USING (false);

DROP POLICY IF EXISTS activity_logs_no_delete ON public.activity_logs;
CREATE POLICY activity_logs_no_delete
  ON public.activity_logs
  FOR DELETE
  TO authenticated
  USING (false);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS meals_select_own ON public.meals;
CREATE POLICY meals_select_own ON public.meals FOR SELECT TO authenticated
  USING (user_id = private.coach_user_id());

DROP POLICY IF EXISTS meals_insert_own ON public.meals;
CREATE POLICY meals_insert_own ON public.meals FOR INSERT TO authenticated
  WITH CHECK (user_id = private.coach_user_id());

DROP POLICY IF EXISTS meals_update_own ON public.meals;
CREATE POLICY meals_update_own ON public.meals FOR UPDATE TO authenticated
  USING (user_id = private.coach_user_id())
  WITH CHECK (user_id = private.coach_user_id());

DROP POLICY IF EXISTS meals_delete_own ON public.meals;
CREATE POLICY meals_delete_own ON public.meals FOR DELETE TO authenticated
  USING (user_id = private.coach_user_id());

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS exercises_select_own ON public.exercises;
CREATE POLICY exercises_select_own ON public.exercises FOR SELECT TO authenticated
  USING (user_id = private.coach_user_id());

DROP POLICY IF EXISTS exercises_insert_own ON public.exercises;
CREATE POLICY exercises_insert_own ON public.exercises FOR INSERT TO authenticated
  WITH CHECK (user_id = private.coach_user_id());

DROP POLICY IF EXISTS exercises_update_own ON public.exercises;
CREATE POLICY exercises_update_own ON public.exercises FOR UPDATE TO authenticated
  USING (user_id = private.coach_user_id())
  WITH CHECK (user_id = private.coach_user_id());

DROP POLICY IF EXISTS exercises_delete_own ON public.exercises;
CREATE POLICY exercises_delete_own ON public.exercises FOR DELETE TO authenticated
  USING (user_id = private.coach_user_id());

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clients_select_own ON public.clients;
CREATE POLICY clients_select_own ON public.clients FOR SELECT TO authenticated
  USING (user_id = private.coach_user_id());

DROP POLICY IF EXISTS clients_insert_own ON public.clients;
CREATE POLICY clients_insert_own ON public.clients FOR INSERT TO authenticated
  WITH CHECK (user_id = private.coach_user_id());

DROP POLICY IF EXISTS clients_update_own ON public.clients;
CREATE POLICY clients_update_own ON public.clients FOR UPDATE TO authenticated
  USING (user_id = private.coach_user_id())
  WITH CHECK (user_id = private.coach_user_id());

DROP POLICY IF EXISTS clients_delete_own ON public.clients;
CREATE POLICY clients_delete_own ON public.clients FOR DELETE TO authenticated
  USING (user_id = private.coach_user_id());

ALTER TABLE public.supplements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS supplements_select_own ON public.supplements;
CREATE POLICY supplements_select_own ON public.supplements FOR SELECT TO authenticated
  USING (user_id = private.coach_user_id());

DROP POLICY IF EXISTS supplements_insert_own ON public.supplements;
CREATE POLICY supplements_insert_own ON public.supplements FOR INSERT TO authenticated
  WITH CHECK (user_id = private.coach_user_id());

DROP POLICY IF EXISTS supplements_update_own ON public.supplements;
CREATE POLICY supplements_update_own ON public.supplements FOR UPDATE TO authenticated
  USING (user_id = private.coach_user_id())
  WITH CHECK (user_id = private.coach_user_id());

DROP POLICY IF EXISTS supplements_delete_own ON public.supplements;
CREATE POLICY supplements_delete_own ON public.supplements FOR DELETE TO authenticated
  USING (user_id = private.coach_user_id());
