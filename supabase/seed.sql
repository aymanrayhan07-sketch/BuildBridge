-- BuildBridge Demo Seed Data
-- Demo User, Project: "Waiting Room App", Planner Chat, Agent Chat, Plan, Prompt, Memory

-- 1. Demo User
INSERT INTO users (id, email, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@buildbridge.dev', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Demo Project
INSERT INTO projects (
  id,
  user_id,
  name,
  idea_text,
  status,
  planner_model,
  builder_model,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'Waiting Room App',
  'I want to build a web app where people join a queue, see their token number, and staff can call the next person.',
  'planned',
  'google/gemini-2.5-flash',
  'deepseek/deepseek-chat',
  NOW() - INTERVAL '2 hours',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 3. Planner Chat: "Initial idea"
INSERT INTO planner_chats (
  id,
  project_id,
  title,
  created_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Initial idea',
  NOW() - INTERVAL '2 hours'
) ON CONFLICT (id) DO NOTHING;

-- Messages for Planner Chat
INSERT INTO messages (id, chat_id, chat_type, role, content, model_used, created_at)
VALUES 
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'planner',
  'user',
  'I want to build a web app where people join a queue, see their token number, and staff can call the next person.',
  NULL,
  NOW() - INTERVAL '1 hour 50 minutes'
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'planner',
  'assistant',
  'That is a great utility! A real-time digital queue system needs two core personas: the Patient/Customer view and the Staff/Operator dashboard. Let us break this down into clear components: 1) Public queue check-in and live token display, 2) Staff admin panel to call, hold, or complete tickets, 3) Real-time state synchronization using Supabase Realtime or WebSockets. Would you like me to generate the full project plan?',
  'google/gemini-2.5-flash',
  NOW() - INTERVAL '1 hour 45 minutes'
);

-- 4. Agent Chat: "Build Version 1"
INSERT INTO agent_chats (
  id,
  project_id,
  title,
  status,
  created_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'Build Version 1',
  'active',
  NOW() - INTERVAL '1 hour'
) ON CONFLICT (id) DO NOTHING;

-- 5. Sample Project Memory entries
INSERT INTO project_memory (id, project_id, memory_type, title, content, importance, created_at, updated_at)
VALUES
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'goal',
  'Project Objective',
  'Build a responsive web application where visitors join a queue, receive a real-time token number, and staff manage calls and attendance.',
  'critical',
  NOW() - INTERVAL '1 hour 40 minutes',
  NOW()
),
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'decision',
  'Architecture & Stack Decisions',
  'Decided to use Next.js 15 App Router with Tailwind CSS and Supabase PostgreSQL. Token generation will be sequential per day with status: waiting, called, completed, cancelled.',
  'high',
  NOW() - INTERVAL '1 hour 35 minutes',
  NOW()
),
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'progress',
  'Phase 1 Architecture Plan Approved',
  'Defined public check-in screen, queue status live board, and operator controls. Prepared initial Builder Agent prompt.',
  'normal',
  NOW() - INTERVAL '1 hour 30 minutes',
  NOW()
),
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'issue',
  'Audio Notification Compatibility',
  'Audio chime when a token is called requires user interaction permissions in modern browsers. Need a visual toggle for sound alert.',
  'normal',
  NOW() - INTERVAL '1 hour 20 minutes',
  NOW()
);

-- 6. Sample Agent Prompt
INSERT INTO agent_prompts (
  id,
  project_id,
  agent_chat_id,
  prompt_text,
  status,
  created_at
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'Context: Waiting Room App prototype. Build the core token queue management interface.
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
- List shows remaining waiting guests.',
  'ready',
  NOW() - INTERVAL '1 hour'
) ON CONFLICT (id) DO NOTHING;
