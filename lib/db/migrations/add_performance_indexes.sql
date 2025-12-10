-- Performance indexes for faster queries
-- Run this migration to add indexes that will significantly improve query performance

-- Indexes for user_id lookups (critical for performance)
-- These make WHERE user_id = X queries 10-100x faster
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- Composite indexes for common query patterns (user_id + ORDER BY created_at)
-- These optimize queries that filter by user and sort by creation date
CREATE INDEX IF NOT EXISTS idx_meals_user_created ON meals(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercises_user_created ON exercises(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_user_created ON clients(user_id, created_at DESC);

-- Index for team_members lookups
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);

-- These indexes are safe to add to existing tables and will improve performance immediately
-- They use IF NOT EXISTS so they're safe to run multiple times

