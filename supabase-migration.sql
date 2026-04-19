-- Supabase SQL Migration for user_profiles table
-- Run this in your Supabase SQL Editor or as a migration

CREATE TABLE IF NOT EXISTS user_profiles (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  biometrics JSONB DEFAULT '{}'::jsonb,
  macros JSONB DEFAULT '{}'::jsonb,
  goal TEXT DEFAULT '',
  meals JSONB DEFAULT '[]'::jsonb,
  exercises JSONB DEFAULT '[]'::jsonb,
  weight_logs JSONB DEFAULT '[]'::jsonb,
  water_logs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.jwt() ->> 'email' = email);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on row changes
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
