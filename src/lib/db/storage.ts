import fs from 'fs';
import path from 'path';
import {
  User,
  Project,
  PlannerChat,
  AgentChat,
  Message,
  ProjectMemory,
  AgentPrompt,
  AgentArtifact,
  ApiKeyItem,
} from '@/types';
import { maskApiKey } from '@/lib/crypto';

interface DbData {
  users: User[];
  projects: Project[];
  planner_chats: PlannerChat[];
  agent_chats: AgentChat[];
  messages: Message[];
  project_memory: ProjectMemory[];
  agent_prompts: AgentPrompt[];
  agent_artifacts: AgentArtifact[];
  api_keys: (ApiKeyItem & { raw_key?: string })[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_DEMO_DATA: DbData = {
  users: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'demo@buildbridge.dev',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  projects: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'Waiting Room App',
      idea_text:
        'I want to build a web app where people join a queue, see their token number, and staff can call the next person.',
      status: 'planned',
      planner_model: 'google/gemini-2.5-flash',
      builder_model: 'deepseek/deepseek-chat',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  planner_chats: [
    {
      id: '22222222-2222-2222-2222-222222222222',
      project_id: '11111111-1111-1111-1111-111111111111',
      title: 'Initial idea',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  agent_chats: [
    {
      id: '33333333-3333-3333-3333-333333333333',
      project_id: '11111111-1111-1111-1111-111111111111',
      title: 'Build Version 1',
      status: 'active',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  messages: [
    {
      id: '55555555-5555-5555-5555-555555555551',
      chat_id: '22222222-2222-2222-2222-222222222222',
      chat_type: 'planner',
      role: 'user',
      content:
        'I want to build a web app where people join a queue, see their token number, and staff can call the next person.',
      created_at: new Date(Date.now() - 6600000).toISOString(),
    },
    {
      id: '55555555-5555-5555-5555-555555555552',
      chat_id: '22222222-2222-2222-2222-222222222222',
      chat_type: 'planner',
      role: 'assistant',
      content:
        'That is a great utility! A real-time digital queue system needs two core personas: the Patient/Customer view and the Staff/Operator dashboard. Let us break this down into clear components: 1) Public queue check-in and live token display, 2) Staff admin panel to call, hold, or complete tickets, 3) Real-time state synchronization using Supabase Realtime or WebSockets. Would you like me to generate the full project plan?',
      model_used: 'google/gemini-2.5-flash',
      tokens_in: 32,
      tokens_out: 85,
      created_at: new Date(Date.now() - 6300000).toISOString(),
    },
  ],
  project_memory: [
    {
      id: '66666666-6666-6666-6666-666666666661',
      project_id: '11111111-1111-1111-1111-111111111111',
      memory_type: 'goal',
      title: 'Project Objective',
      content:
        'Build a responsive web application where visitors join a queue, receive a real-time token number, and staff manage calls and attendance.',
      importance: 'critical',
      created_at: new Date(Date.now() - 6000000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '66666666-6666-6666-6666-666666666662',
      project_id: '11111111-1111-1111-1111-111111111111',
      memory_type: 'decision',
      title: 'Architecture & Stack Decisions',
      content:
        'Decided to use Next.js 15 App Router with Tailwind CSS and Supabase PostgreSQL. Token generation will be sequential per day with status: waiting, called, completed, cancelled.',
      importance: 'high',
      created_at: new Date(Date.now() - 5700000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '66666666-6666-6666-6666-666666666663',
      project_id: '11111111-1111-1111-1111-111111111111',
      memory_type: 'progress',
      title: 'Phase 1 Architecture Plan Approved',
      content:
        'Defined public check-in screen, queue status live board, and operator controls. Prepared initial Builder Agent prompt.',
      importance: 'normal',
      created_at: new Date(Date.now() - 5400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '66666666-6666-6666-6666-666666666664',
      project_id: '11111111-1111-1111-1111-111111111111',
      memory_type: 'issue',
      title: 'Audio Notification Compatibility',
      content:
        'Audio chime when a token is called requires user interaction permissions in modern browsers. Need a visual toggle for sound alert.',
      importance: 'normal',
      created_at: new Date(Date.now() - 4800000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  agent_prompts: [
    {
      id: '44444444-4444-4444-4444-444444444444',
      project_id: '11111111-1111-1111-1111-111111111111',
      agent_chat_id: '33333333-3333-3333-3333-333333333333',
      prompt_text: `Context: Waiting Room App prototype. Build the core token queue management interface.
Exact task:
1. Create a queue state store managing tokens (id, number, name, status: waiting | called | done).
2. Create two views: Public Screen displaying "Currently Serving: #X" and a Staff Operator Panel with "Call Next", "Recall", and "Mark Done" buttons.
3. Add a check-in modal where guests type their name and receive a token ticket.
Files:
- components/QueueDisplay.tsx
- components/StaffPanel.tsx
- components/CheckInModal.tsx
Constraints:
- Clean responsive Tailwind CSS styling.
- No external state libraries beyond React state or Context.
Acceptance Criteria:
- Guest clicks Check In -> Gets next sequential token.
- Staff clicks Call Next -> Serving token increments and displays with audio/visual flash indicator.
- List shows remaining waiting guests.`,
      status: 'ready',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  agent_artifacts: [
    {
      id: '77777777-7777-7777-7777-777777777771',
      project_id: '11111111-1111-1111-1111-111111111111',
      agent_chat_id: '33333333-3333-3333-3333-333333333333',
      artifact_type: 'output',
      content:
        'Completed initial draft of QueueDisplay.tsx, StaffPanel.tsx, and CheckInModal.tsx. All components render with token state hooks and call next functionality.',
      created_at: new Date(Date.now() - 3000000).toISOString(),
    },
  ],
  api_keys: [],
};

let inMemoryStore: DbData | null = null;

function loadDb(): DbData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryStore = JSON.parse(content) as DbData;
      return inMemoryStore;
    }
  } catch {
    // If reading fails, keep current or clone initial
  }

  if (inMemoryStore) {
    return inMemoryStore;
  }

  // Deep clone initial data
  inMemoryStore = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  saveDb(inMemoryStore!);
  return inMemoryStore!;
}

function saveDb(data: DbData): void {
  inMemoryStore = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Keep in-memory copy
  }
}

export const localDb = {
  // Users
  getUserByEmail(email: string): User | undefined {
    const db = loadDb();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById(id: string): User | undefined {
    const db = loadDb();
    return db.users.find((u) => u.id === id);
  },
  createUser(email: string, id?: string): User {
    const db = loadDb();
    const newUser: User = {
      id: id || crypto.randomUUID(),
      email,
      created_at: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDb(db);
    return newUser;
  },

  // Projects
  getProjects(userId: string): Project[] {
    const db = loadDb();
    // In demo mode, also allow accessing demo projects
    return db.projects
      .filter((p) => p.user_id === userId || userId === '00000000-0000-0000-0000-000000000001' || p.user_id === '00000000-0000-0000-0000-000000000001')
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },
  getProjectById(projectId: string): Project | undefined {
    const db = loadDb();
    return db.projects.find((p) => p.id === projectId);
  },
  createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const db = loadDb();
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.projects.push(newProject);
    saveDb(db);
    return newProject;
  },
  updateProject(projectId: string, updates: Partial<Project>): Project | undefined {
    const db = loadDb();
    const index = db.projects.findIndex((p) => p.id === projectId);
    if (index === -1) return undefined;
    db.projects[index] = {
      ...db.projects[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveDb(db);
    return db.projects[index];
  },
  deleteProject(projectId: string): boolean {
    const db = loadDb();
    const beforeCount = db.projects.length;
    db.projects = db.projects.filter((p) => p.id !== projectId);
    if (db.projects.length !== beforeCount) {
      db.planner_chats = db.planner_chats.filter((c) => c.project_id !== projectId);
      db.agent_chats = db.agent_chats.filter((c) => c.project_id !== projectId);
      db.project_memory = db.project_memory.filter((m) => m.project_id !== projectId);
      db.agent_prompts = db.agent_prompts.filter((p) => p.project_id !== projectId);
      db.agent_artifacts = db.agent_artifacts.filter((a) => a.project_id !== projectId);
      saveDb(db);
      return true;
    }
    return false;
  },

  // Planner Chats
  getPlannerChats(projectId: string): PlannerChat[] {
    const db = loadDb();
    return db.planner_chats
      .filter((c) => c.project_id === projectId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },
  createPlannerChat(projectId: string, title: string): PlannerChat {
    const db = loadDb();
    const chat: PlannerChat = {
      id: crypto.randomUUID(),
      project_id: projectId,
      title,
      created_at: new Date().toISOString(),
    };
    db.planner_chats.push(chat);
    saveDb(db);
    return chat;
  },

  // Agent Chats
  getAgentChats(projectId: string): AgentChat[] {
    const db = loadDb();
    return db.agent_chats
      .filter((c) => c.project_id === projectId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },
  createAgentChat(projectId: string, title: string): AgentChat {
    const db = loadDb();
    const chat: AgentChat = {
      id: crypto.randomUUID(),
      project_id: projectId,
      title,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    db.agent_chats.push(chat);
    saveDb(db);
    return chat;
  },

  // Messages
  getMessages(chatId: string): Message[] {
    const db = loadDb();
    return db.messages
      .filter((m) => m.chat_id === chatId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },
  createMessage(message: Omit<Message, 'id' | 'created_at'>): Message {
    const db = loadDb();
    const newMsg: Message = {
      ...message,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    db.messages.push(newMsg);
    saveDb(db);
    return newMsg;
  },

  // Project Memory
  getProjectMemory(projectId: string): ProjectMemory[] {
    const db = loadDb();
    return db.project_memory
      .filter((m) => m.project_id === projectId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  createProjectMemory(memory: Omit<ProjectMemory, 'id' | 'created_at' | 'updated_at'>): ProjectMemory {
    const db = loadDb();
    const newMem: ProjectMemory = {
      ...memory,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.project_memory.push(newMem);
    saveDb(db);
    return newMem;
  },

  // Agent Prompts
  getAgentPrompts(projectId: string, agentChatId?: string): AgentPrompt[] {
    const db = loadDb();
    return db.agent_prompts
      .filter((p) => p.project_id === projectId && (!agentChatId || p.agent_chat_id === agentChatId))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  createAgentPrompt(prompt: Omit<AgentPrompt, 'id' | 'created_at'>): AgentPrompt {
    const db = loadDb();
    const newPrompt: AgentPrompt = {
      ...prompt,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    db.agent_prompts.push(newPrompt);
    saveDb(db);
    return newPrompt;
  },

  // Agent Artifacts
  getAgentArtifacts(projectId: string, agentChatId?: string): AgentArtifact[] {
    const db = loadDb();
    return db.agent_artifacts
      .filter((a) => a.project_id === projectId && (!agentChatId || a.agent_chat_id === agentChatId))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  createAgentArtifact(artifact: Omit<AgentArtifact, 'id' | 'created_at'>): AgentArtifact {
    const db = loadDb();
    const newArtifact: AgentArtifact = {
      ...artifact,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    db.agent_artifacts.push(newArtifact);
    saveDb(db);
    return newArtifact;
  },

  // API Keys
  getApiKeys(userId: string): ApiKeyItem[] {
    const db = loadDb();
    return db.api_keys
      .filter((k) => k.user_id === userId)
      .map((k) => ({
        id: k.id,
        user_id: k.user_id,
        provider: k.provider,
        masked_key: k.masked_key || maskApiKey(k.raw_key || ''),
        label: k.label,
        created_at: k.created_at,
      }));
  },
  getRawApiKey(userId: string, provider = 'openrouter'): string | undefined {
    const db = loadDb();
    const key = db.api_keys.find((k) => k.user_id === userId && k.provider === provider);
    return key?.raw_key;
  },
  createApiKey(userId: string, provider: string, rawKey: string, label?: string): ApiKeyItem {
    const db = loadDb();
    const newKey = {
      id: crypto.randomUUID(),
      user_id: userId,
      provider,
      raw_key: rawKey,
      masked_key: maskApiKey(rawKey),
      label: label || 'OpenRouter Key',
      created_at: new Date().toISOString(),
    };
    db.api_keys.push(newKey);
    saveDb(db);
    return {
      id: newKey.id,
      user_id: newKey.user_id,
      provider: newKey.provider,
      masked_key: newKey.masked_key,
      label: newKey.label,
      created_at: newKey.created_at,
    };
  },
  deleteApiKey(keyId: string, userId: string): boolean {
    const db = loadDb();
    const prev = db.api_keys.length;
    db.api_keys = db.api_keys.filter((k) => !(k.id === keyId && k.user_id === userId));
    saveDb(db);
    return db.api_keys.length !== prev;
  },
};
