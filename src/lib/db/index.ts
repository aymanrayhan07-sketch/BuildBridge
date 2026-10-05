import { localDb } from './storage';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import {
  Project,
  PlannerChat,
  AgentChat,
  Message,
  ProjectMemory,
  AgentPrompt,
  AgentArtifact,
  ApiKeyItem,
} from '@/types';

// Check if live Supabase is configured
const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo.supabase.co' &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const db = {
  async getProjects(userId: string): Promise<Project[]> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed querying Supabase projects, using local fallback', { err });
      }
    }
    return localDb.getProjects(userId);
  },

  async getProjectById(projectId: string): Promise<Project | null> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed querying Supabase project by id', { projectId, err });
      }
    }
    return localDb.getProjectById(projectId) || null;
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('projects')
            .insert([project])
            .select()
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed creating project in Supabase', { err });
      }
    }
    return localDb.createProject(project);
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('projects')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', projectId)
            .select()
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed updating project in Supabase', { projectId, err });
      }
    }
    return localDb.updateProject(projectId, updates) || null;
  },

  async deleteProject(projectId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { error } = await client.from('projects').delete().eq('id', projectId);
          if (!error) return true;
        }
      } catch (err) {
        logger.warn('Failed deleting project in Supabase', { projectId, err });
      }
    }
    return localDb.deleteProject(projectId);
  },

  async getPlannerChats(projectId: string): Promise<PlannerChat[]> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('planner_chats')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed getting planner chats from Supabase', { projectId, err });
      }
    }
    return localDb.getPlannerChats(projectId);
  },

  async createPlannerChat(projectId: string, title: string): Promise<PlannerChat> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('planner_chats')
            .insert([{ project_id: projectId, title }])
            .select()
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed creating planner chat in Supabase', { projectId, err });
      }
    }
    return localDb.createPlannerChat(projectId, title);
  },

  async getAgentChats(projectId: string): Promise<AgentChat[]> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('agent_chats')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed getting agent chats from Supabase', { projectId, err });
      }
    }
    return localDb.getAgentChats(projectId);
  },

  async createAgentChat(projectId: string, title: string): Promise<AgentChat> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('agent_chats')
            .insert([{ project_id: projectId, title, status: 'active' }])
            .select()
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed creating agent chat in Supabase', { projectId, err });
      }
    }
    return localDb.createAgentChat(projectId, title);
  },

  async getMessages(chatId: string): Promise<Message[]> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed getting messages from Supabase', { chatId, err });
      }
    }
    return localDb.getMessages(chatId);
  },

  async createMessage(msg: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client.from('messages').insert([msg]).select().single();
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed inserting message into Supabase', { err });
      }
    }
    return localDb.createMessage(msg);
  },

  async getProjectMemory(projectId: string): Promise<ProjectMemory[]> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('project_memory')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed getting project memory from Supabase', { projectId, err });
      }
    }
    return localDb.getProjectMemory(projectId);
  },

  async createProjectMemory(
    memory: Omit<ProjectMemory, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ProjectMemory> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('project_memory')
            .insert([memory])
            .select()
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed inserting project memory into Supabase', { err });
      }
    }
    return localDb.createProjectMemory(memory);
  },

  async getAgentPrompts(projectId: string, agentChatId?: string): Promise<AgentPrompt[]> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          let query = client.from('agent_prompts').select('*').eq('project_id', projectId);
          if (agentChatId) query = query.eq('agent_chat_id', agentChatId);
          const { data, error } = await query.order('created_at', { ascending: false });
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed getting agent prompts from Supabase', { projectId, err });
      }
    }
    return localDb.getAgentPrompts(projectId, agentChatId);
  },

  async createAgentPrompt(prompt: Omit<AgentPrompt, 'id' | 'created_at'>): Promise<AgentPrompt> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('agent_prompts')
            .insert([prompt])
            .select()
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed creating agent prompt in Supabase', { err });
      }
    }
    return localDb.createAgentPrompt(prompt);
  },

  async getAgentArtifacts(projectId: string, agentChatId?: string): Promise<AgentArtifact[]> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          let query = client.from('agent_artifacts').select('*').eq('project_id', projectId);
          if (agentChatId) query = query.eq('agent_chat_id', agentChatId);
          const { data, error } = await query.order('created_at', { ascending: false });
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed getting agent artifacts from Supabase', { projectId, err });
      }
    }
    return localDb.getAgentArtifacts(projectId, agentChatId);
  },

  async createAgentArtifact(
    artifact: Omit<AgentArtifact, 'id' | 'created_at'>
  ): Promise<AgentArtifact> {
    if (isSupabaseConfigured) {
      try {
        const client = createAdminClient();
        if (client) {
          const { data, error } = await client
            .from('agent_artifacts')
            .insert([artifact])
            .select()
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        logger.warn('Failed creating agent artifact in Supabase', { err });
      }
    }
    return localDb.createAgentArtifact(artifact);
  },

  async getApiKeys(userId: string): Promise<ApiKeyItem[]> {
    return localDb.getApiKeys(userId);
  },

  async createApiKey(
    userId: string,
    provider: string,
    rawKey: string,
    label?: string
  ): Promise<ApiKeyItem> {
    return localDb.createApiKey(userId, provider, rawKey, label);
  },

  async deleteApiKey(keyId: string, userId: string): Promise<boolean> {
    return localDb.deleteApiKey(keyId, userId);
  },

  async getActiveOpenRouterKey(userId: string): Promise<string | undefined> {
    const userKey = localDb.getRawApiKey(userId, 'openrouter');
    if (userKey) return userKey;
    return process.env.OPENROUTER_API_KEY;
  },
};
