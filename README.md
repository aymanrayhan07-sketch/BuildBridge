# BuildBridge 🌉

**The unified AI workspace bridging Perplexity-style architectural planning and external AI coding agent workflows.**

BuildBridge solves the recurring problem developers face when interacting with AI coding agents: having to repeatedly re-explain project context, decisions, and system constraints across separate chat windows and tools. By sharing a persistent, structured **Project Memory** between the **Planner AI** and the **Builder Agent Workspace**, BuildBridge maintains continuous context across the entire project lifecycle.

---

## 🚀 Key Features

1. **Perplexity-Style Planner Chat (Blue Theme)**
   - Researches technologies and explains architecture in clear language.
   - Refines vague ideas into structured specifications.
   - Generates official Project Plans (`Create Project Plan`).
   - Objective review engine that inspects builder outputs, terminal logs, and screenshots.

2. **Builder Agent Workspace (Violet Theme)**
   - Formats single-scoped, modular prompts optimized for external agents: **Cline**, **Codex**, **Antigravity**, or **Claude Code**.
   - Copy-to-clipboard button with visual feedback.
   - Import area for pasting terminal outputs, diffs, and code.
   - Screenshot upload tool for visual verification.
   - Artifacts catalog with logs, outputs, and images.

3. **Persistent Project Memory**
   - Stores **Goals**, **Decisions**, **Progress**, **Issues**, and **Preferences**.
   - Grounding bridge: New chats start fresh (without messy conversational baggage) but automatically load the latest Project Memory.
   - Context badge: *"Project memory loaded"* ensures transparent model grounding.

4. **Zero-Auto Execution & Strict Human Permission**
   - Nothing happens automatically without clicking a button.
   - Explicit permission banner for all proposed agent code changes.

5. **Security & Key Masking**
   - OpenRouter API keys are encrypted server-side and never exposed in browser bundles, responses, or logs.
   - Masked key display: `sk-or-••••1234`.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & local storage fallback adapter
- **AI Engine**: OpenRouter Chat Completions (`/api/v1/chat/completions`) with built-in prototype fallback simulation
- **Validation**: Zod schema validation on all API endpoints
- **Data Fetching**: SWR & React Server Components
- **Logging**: Structured JSON logger (`src/lib/logger.ts`) with automatic credential redaction

---

## 📦 Project Structure

```text
buildbridge/
├── .data/                     # Local persistent storage for zero-config prototype testing
├── public/                    # Static assets
├── scripts/
│   ├── test-api.mjs           # Automated E2E verification of all 8 core API endpoints
│   └── test-user-flow.mjs     # Automated verification of signup, project, and isolation flow
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── agent/         # Agent chats, output import, screenshot upload
│   │   │   ├── auth/          # Login, signup, logout, session me
│   │   │   ├── keys/          # API key encryption, masking, and management
│   │   │   ├── messages/      # Chat message storage
│   │   │   ├── planner/       # Planner chat, plan generation, output review, next prompt
│   │   │   └── projects/      # Project CRUD and project memory retrieval
│   │   ├── login/             # Login page with demo access
│   │   ├── projects/          # Projects dashboard & /new project creation
│   │   │   └── [id]/          # Three-column main workspace
│   │   ├── signup/            # Account signup page
│   │   ├── globals.css        # Tailwind theme and dark-mode styling
│   │   └── page.tsx           # Product landing page & workflow overview
│   ├── components/
│   │   ├── ApprovalBanner.tsx # Permission-style approval UI
│   │   ├── BuilderAgentView.tsx # Right column Builder Workspace
│   │   ├── Navbar.tsx         # Global navigation header with status badge
│   │   ├── PlannerChatView.tsx  # Middle column Planner Chat
│   │   ├── ProjectMemorySummary.tsx # Shared project memory card list
│   │   ├── SettingsModal.tsx  # Modal for secure API key configuration
│   │   ├── Sidebar.tsx        # Left column chats and project navigation
│   │   └── StatusBadge.tsx    # Dynamic color-coded status badges
│   ├── lib/
│   │   ├── ai/openrouter.ts   # OpenRouter client & structured prompting
│   │   ├── auth.ts            # Authentication helpers
│   │   ├── constants.ts       # Supported models and status palettes
│   │   ├── crypto.ts          # Key encryption & masking (sk-or-••••1234)
│   │   ├── db/                # Unified database adapter & local store
│   │   ├── logger.ts          # Redacted structured JSON logger
│   │   └── supabase/          # Supabase client, server, and admin helpers
│   └── types/                 # TypeScript interfaces
├── supabase/
│   ├── schema.sql             # PostgreSQL schema with Row Level Security (RLS)
│   └── seed.sql               # Demo data seed ("Waiting Room App")
├── .env.example
├── README.md
├── package.json
└── tsconfig.json
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 10+

### 2. Install Dependencies
```bash
cd buildbridge
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DATABASE_URL=postgresql://postgres:...
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_DEFAULT_PLANNER_MODEL=google/gemini-2.5-flash
OPENROUTER_DEFAULT_BUILDER_MODEL=deepseek/deepseek-chat
```

> **Note**: BuildBridge is designed to work immediately out of the box even without external Supabase or OpenRouter credentials configured. It automatically uses an intelligent built-in simulation layer and persistent local storage so you can test all features right away.

---

## 🗄️ Supabase Setup

To connect to a live remote Supabase PostgreSQL database:

1. Create a new project in your [Supabase Dashboard](https://supabase.com).
2. Navigate to **SQL Editor**.
3. Open `supabase/schema.sql` from this repository, paste the contents into the SQL Editor, and click **Run**. This creates all 9 tables with Row Level Security (RLS) enabled:
   - `users`
   - `projects`
   - `planner_chats`
   - `agent_chats`
   - `messages`
   - `project_memory`
   - `agent_prompts`
   - `agent_artifacts`
   - `api_keys`
4. (Optional) Run `supabase/seed.sql` to populate the demo project **"Waiting Room App"**.
5. Copy your Project URL and Anon/Service Role Keys from **Project Settings > API** into `.env.local`.

---

## 🔑 Adding an OpenRouter API Key

You can configure an OpenRouter API key in two ways:

1. **Environment Level**: Set `OPENROUTER_API_KEY=sk-or-v1-...` in `.env.local`.
2. **User Interface**:
   - In BuildBridge, click the **"API Keys"** button in the top navigation bar.
   - Enter your OpenRouter key (e.g. `sk-or-v1-...`) and an optional label.
   - Click **Save Key**.
   - Your key is securely encrypted on the server. The frontend receives and displays only the masked key (e.g. `sk-or-••••1234`).

---

## 💻 Running the App

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Running Automated Verification Tests
To run the automated end-to-end tests against the running dev server:
```bash
node scripts/test-api.mjs
node scripts/test-user-flow.mjs
```

---

## 🚶 Main User Walkthrough

1. **Landing Page (`/`)**:
   - Review the 4-step workflow: **Plan → Build → Review → Improve**. Click **Get Started**.
2. **Sign In (`/login`)**:
   - Click **"Continue as Demo User"** or register a new account.
3. **Projects Dashboard (`/projects`)**:
   - Notice the preloaded **Waiting Room App** demo project showing status, planner model (`gemini-2.5-flash`), builder model (`deepseek-chat`), and updated timestamp.
   - Click **Open Workspace**.
4. **Three-Column Workspace (`/projects/[id]`)**:
   - **Left Sidebar**: Switch between Planner Chats (`Initial idea`) and Builder Agent Chats (`Build Version 1`), or click `+ New Planner Chat` to create a new session.
   - **Middle Column (Planner Chat)**:
     - Notice the badge: `Project memory loaded (4 items)` and `Sharing: Agent Session #1`.
     - Click **Create Project Plan** to ask the Planner to architect the technical solution and save the approved plan to Project Memory.
     - Click **Generate Agent Prompt** to craft a single scoped prompt for the builder agent.
   - **Right Column (Builder Agent Workspace)**:
     - View the generated prompt with exact constraints and acceptance criteria.
     - Click **Copy Prompt** (ready to paste into Cline, Codex, Antigravity, or Claude Code).
     - Under **Import Agent Output**, paste the simulated external code output and click **Save Agent Output & Update Memory**.
     - Optionally upload a screenshot under **Upload Agent Screenshot Evidence**.
   - **Review Workflow**:
     - In the Planner Chat, click **Review Agent Output**.
     - The Planner analyzes the agent output against Project Memory and returns a structured evaluation:
       - **Status**: Completed / Partially completed / Not completed
       - **Evidence found**
       - **Completed items**
       - **Missing items**
       - **Next recommended task**
     - Click **Generate Next Prompt** to produce the subsequent task prompt for the external coding agent.

---

## ⚠️ Known Limitations

- **External Agent Invocation**: BuildBridge is a control bridge and does not directly execute or automate external IDE tools like Cline or Claude Code directly via process injection. Prompts and outputs are exchanged via copy-paste and file import to ensure complete user sovereignty and approval.
- **Browser Audio Permissions**: Web Audio API chimes require user interaction in modern browsers before playing automated alerts.
- **File System Write**: The prototype imports agent output text and screenshots as artifacts rather than automatically rewriting local disk source files without user approval.
