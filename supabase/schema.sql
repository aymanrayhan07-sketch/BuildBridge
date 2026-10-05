-- BuildBridge Supabase PostgreSQL Schema
-- Row Level Security (RLS) enabled on all tables

-- 1. Users table (synced with auth.users if needed or standalone)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  idea_text TEXT,
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'planned', 'prompt ready', 'building', 'needs review', 'needs fix', 'completed')),
  planner_model TEXT DEFAULT 'google/gemini-2.5-flash',
  builder_model TEXT DEFAULT 'deepseek/deepseek-chat',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Planner Chats
CREATE TABLE IF NOT EXISTS planner_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Agent Chats
CREATE TABLE IF NOT EXISTS agent_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL,
  chat_type TEXT NOT NULL CHECK (chat_type IN ('planner', 'agent')),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_used TEXT,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Project Memory
CREATE TABLE IF NOT EXISTS project_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('goal', 'decision', 'progress', 'issue', 'preference')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_chat_id UUID,
  importance TEXT DEFAULT 'normal' CHECK (importance IN ('low', 'normal', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Agent Prompts
CREATE TABLE IF NOT EXISTS agent_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  agent_chat_id UUID REFERENCES agent_chats(id) ON DELETE CASCADE NOT NULL,
  prompt_text TEXT NOT NULL,
  status TEXT DEFAULT 'ready' CHECK (status IN ('ready', 'in_progress', 'applied', 'revised')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Agent Artifacts
CREATE TABLE IF NOT EXISTS agent_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  agent_chat_id UUID REFERENCES agent_chats(id) ON DELETE CASCADE NOT NULL,
  artifact_type TEXT NOT NULL CHECK (artifact_type IN ('screenshot', 'log', 'file_list', 'output')),
  file_url TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. API Keys (Stored server-side, encrypted or masked representation)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Helper policies for authenticated users
-- Users
CREATE POLICY "Users can manage their own profile" ON users
  FOR ALL USING (auth.uid() = id);

-- Projects
CREATE POLICY "Users can manage their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- Planner Chats
CREATE POLICY "Users can manage planner chats for their projects" ON planner_chats
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = planner_chats.project_id AND projects.user_id = auth.uid())
  );

-- Agent Chats
CREATE POLICY "Users can manage agent chats for their projects" ON agent_chats
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = agent_chats.project_id AND projects.user_id = auth.uid())
  );

-- Messages
CREATE POLICY "Users can manage messages for their chats" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM planner_chats 
      JOIN projects ON projects.id = planner_chats.project_id 
      WHERE planner_chats.id = messages.chat_id AND projects.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM agent_chats 
      JOIN projects ON projects.id = agent_chats.project_id 
      WHERE agent_chats.id = messages.chat_id AND projects.user_id = auth.uid()
    )
  );

-- Project Memory
CREATE POLICY "Users can manage project memory for their projects" ON project_memory
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_memory.project_id AND projects.user_id = auth.uid())
  );

-- Agent Prompts
CREATE POLICY "Users can manage agent prompts for their projects" ON agent_prompts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = agent_prompts.project_id AND projects.user_id = auth.uid())
  );

-- Agent Artifacts
CREATE POLICY "Users can manage agent artifacts for their projects" ON agent_artifacts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = agent_artifacts.project_id AND projects.user_id = auth.uid())
  );

-- API Keys
CREATE POLICY "Users can manage their own API keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id);
