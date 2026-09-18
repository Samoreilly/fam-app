-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Create foods table
CREATE TABLE IF NOT EXISTS foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create person_foods junction table
CREATE TABLE IF NOT EXISTS person_foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_name TEXT NOT NULL CHECK (person_name IN ('Sam', 'Orla', 'Alex', 'Ruth', 'Ian', 'Zach', 'Amelia')),
  food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(person_name, food_id)
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_foods ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow all access to foods" ON foods FOR ALL USING (true);
CREATE POLICY "Allow all access to person_foods" ON person_foods FOR ALL USING (true);
