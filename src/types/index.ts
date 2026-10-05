export type ProjectStatus =
  | 'idea'
  | 'planned'
  | 'prompt ready'
  | 'building'
  | 'needs review'
  | 'needs fix'
  | 'completed';

export type MemoryType = 'goal' | 'decision' | 'progress' | 'issue' | 'preference';
export type MemoryImportance = 'low' | 'normal' | 'high' | 'critical';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  idea_text?: string;
  status: ProjectStatus;
  planner_model: string;
  builder_model: string;
  created_at: string;
  updated_at: string;
}

export interface PlannerChat {
  id: string;
  project_id: string;
  title: string;
  created_at: string;
}

export interface AgentChat {
  id: string;
  project_id: string;
  title: string;
  status: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  chat_type: 'planner' | 'agent';
  role: 'user' | 'assistant' | 'system';
  content: string;
  model_used?: string;
  tokens_in?: number;
  tokens_out?: number;
  created_at: string;
}

export interface ProjectMemory {
  id: string;
  project_id: string;
  memory_type: MemoryType;
  title: string;
  content: string;
  source_chat_id?: string;
  importance: MemoryImportance;
  created_at: string;
  updated_at: string;
}

export interface AgentPrompt {
  id: string;
  project_id: string;
  agent_chat_id: string;
  prompt_text: string;
  status: 'ready' | 'in_progress' | 'applied' | 'revised';
  created_at: string;
}

export interface AgentArtifact {
  id: string;
  project_id: string;
  agent_chat_id: string;
  artifact_type: 'screenshot' | 'log' | 'file_list' | 'output';
  file_url?: string;
  content?: string;
  created_at: string;
}

export interface ApiKeyItem {
  id: string;
  user_id: string;
  provider: string;
  masked_key: string;
  label?: string;
  created_at: string;
}

export interface ReviewResult {
  status: 'Completed' | 'Partially completed' | 'Not completed';
  completed: string[];
  missing: string[];
  broken: string[];
  evidence: string[];
  next_task: string;
}
