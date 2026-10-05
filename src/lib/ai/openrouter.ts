import { logger } from '@/lib/logger';
import { ProjectMemory, ReviewResult } from '@/types';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  content: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
}

export async function callOpenRouter(params: {
  apiKey?: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
}): Promise<OpenRouterResponse> {
  const { apiKey, model, messages, temperature = 0.7 } = params;

  if (apiKey && apiKey.trim() !== '' && !apiKey.includes('supersecret') && !apiKey.includes('mock')) {
    try {
      logger.info('Calling OpenRouter API', { model, messageCount: messages.length });
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': 'https://buildbridge.dev',
          'X-Title': 'BuildBridge Workspace',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        logger.error('OpenRouter API error response', { status: res.status, errorText });
        if (res.status === 401) {
          throw new Error('Unauthorized: Invalid OpenRouter API key. Please check your API key in Settings.');
        } else if (res.status === 402) {
          throw new Error('Payment Required: Your OpenRouter account has insufficient credits or quota.');
        } else if (res.status === 429) {
          throw new Error('Rate Limited: Too many requests sent to OpenRouter. Please wait a moment and try again.');
        } else if (res.status >= 500) {
          throw new Error(`OpenRouter provider error (${res.status}): Upstream AI model is temporarily unavailable.`);
        }
        throw new Error(`OpenRouter error (${res.status}): ${errorText || 'Unknown error'}`);
      }

      const data = await res.json();
      const choice = data.choices?.[0];
      const content = choice?.message?.content || '';
      const tokensIn = data.usage?.prompt_tokens || 0;
      const tokensOut = data.usage?.completion_tokens || 0;

      return {
        content,
        model: data.model || model,
        tokensIn,
        tokensOut,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error('Failed OpenRouter request', { error: errMsg });
      // If network fails or invalid key error, rethrow unless in test mode
      throw new Error(errMsg);
    }
  }

  // Fallback simulator for prototype testing without OpenRouter API key
  logger.info('Using simulated response (no OpenRouter API key configured)', { model });
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  return simulateAiResponse(model, lastUserMsg, messages);
}

function simulateAiResponse(model: string, prompt: string, messages: ChatMessage[]): OpenRouterResponse {
  const isPlan = prompt.toLowerCase().includes('project plan') || prompt.toLowerCase().includes('plan');
  const isReview = prompt.toLowerCase().includes('review') || prompt.toLowerCase().includes('agent output');
  const isPromptGen = prompt.toLowerCase().includes('builder agent prompt') || prompt.toLowerCase().includes('next prompt');

  let content = '';

  if (isPlan) {
    content = `### 📋 Comprehensive Project Plan

#### 1. Architecture Overview
- **Frontend / Client**: Next.js 15 App Router with Tailwind CSS & accessible UI components.
- **Backend / Realtime**: Supabase PostgreSQL with Row-Level Security (RLS) and real-time pub/sub subscriptions.
- **State Management**: React Query / SWR with optimistic updates.

#### 2. Core Modules & Data Models
- **Queue / Token Management**:
  - Sequential daily token generator (\`#A001\`, \`#A002\`).
  - Statuses: \`waiting\`, \`called\`, \`serving\`, \`completed\`, \`no_show\`.
- **Public Screen**:
  - Live full-screen display of current token with audio chime.
  - Estimated wait times based on historical queue throughput.
- **Staff Control Station**:
  - One-click "Call Next", "Recall", and "Mark Done".
  - Multi-counter support (Counter 1, Counter 2).

#### 3. Milestones & Build Order
1. **Milestone 1**: Database schema & token state machine.
2. **Milestone 2**: Public queue display component & customer self-checkin modal.
3. **Milestone 3**: Staff counter panel & real-time synchronization.
4. **Milestone 4**: Audio/visual alerts and polish.`;
  } else if (isReview) {
    content = JSON.stringify({
      status: 'Partially completed',
      completed: [
        'Created initial UI layout for QueueDisplay and StaffPanel components',
        'Added token number state management and increment logic',
        'Implemented responsive desktop and mobile container styles',
      ],
      missing: [
        'Audio chime sound effect for when a token is called',
        'Real-time broadcast hook to keep multiple browser tabs in sync',
        'Input validation on the guest name check-in form',
      ],
      broken: [
        'Recall button triggers counter increment instead of replaying current token',
      ],
      evidence: [
        'Code files QueueDisplay.tsx and StaffPanel.tsx were provided in the agent response',
        'Mark Done handler transitions token status to completed',
      ],
      next_task: 'Fix the Recall button behavior and implement the Web Audio API sound chime toggle.',
    });
  } else if (isPromptGen) {
    content = `Context: Waiting Room App prototype. Build the core token queue management interface.
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
- List shows remaining waiting guests.`;
  } else {
    content = `I understand your vision for this project. To make sure we architect this properly, let's look at the key requirements:

1. **User Experience**: We need a low-friction interface so visitors can check in within 5 seconds without needing an account.
2. **Staff Workflow**: Operators need clear keyboard shortcuts or large buttons to advance the queue quickly during peak hours.
3. **Resilience**: The system should maintain state across page refreshes and display network connectivity status.

Would you like me to generate the full structured **Project Plan**, or shall we refine the specific database requirements first?`;
  }

  return {
    content,
    model: `${model} (Simulated)`,
    tokensIn: Math.floor(prompt.length / 4) + 20,
    tokensOut: Math.floor(content.length / 4) + 15,
  };
}

export function buildPlannerSystemPrompt(memory: ProjectMemory[], projectName: string): string {
  const memoryContext = memory.length > 0
    ? memory.map((m) => `[${m.memory_type.toUpperCase()} - ${m.importance}]: ${m.title}: ${m.content}`).join('\n')
    : 'No prior project memory recorded yet.';

  return `You are BuildBridge Planner AI, an expert research-and-teaching assistant helping a software engineer build the project "${projectName}".

ROLE & BEHAVIOR:
- Answer general questions, explain technical concepts in simple language, and help refine vague ideas.
- Suggest features, solid tech stacks, and modular build orders.
- Only generate a Builder Agent prompt when the user asks.
- Only review agent output or screenshots when the user asks.
- Never claim work is complete unless you have evidence from agent output, logs, file lists, or screenshots.

CURRENT PROJECT MEMORY:
${memoryContext}

Always ground your answers in this shared project memory. Keep responses structured, concise, and actionable.`;
}

export function buildNextPromptSystemPrompt(memory: ProjectMemory[], latestReview?: ReviewResult): string {
  const memoryContext = memory
    .map((m) => `[${m.memory_type.toUpperCase()}]: ${m.title} - ${m.content}`)
    .join('\n');

  const reviewContext = latestReview
    ? `LATEST REVIEW STATUS: ${latestReview.status}
Completed: ${latestReview.completed.join(', ')}
Missing: ${latestReview.missing.join(', ')}
Broken: ${latestReview.broken.join(', ')}
Next Recommended Task: ${latestReview.next_task}`
    : 'No previous agent review available.';

  return `You are BuildBridge Prompt Architect. Your mission is to generate ONE small, clearly scoped, high-precision prompt for an external AI coding agent (such as Cline, Codex, Antigravity, or Claude Code).

PROJECT MEMORY:
${memoryContext}

${reviewContext}

OUTPUT FORMAT RULES:
The generated prompt MUST strictly contain these sections:
1. Current project context
2. Exact task
3. Files to create or modify
4. Constraints
5. What NOT to do
6. "Done when" acceptance criteria

Output ONLY the prompt text without conversational preamble or meta-commentary, ready to be copied directly into the coding agent.`;
}

export function buildReviewSystemPrompt(memory: ProjectMemory[]): string {
  const memoryContext = memory
    .map((m) => `[${m.memory_type.toUpperCase()}]: ${m.title} - ${m.content}`)
    .join('\n');

  return `You are BuildBridge Output Reviewer. You verify whether an external AI coding agent completed the requested task based on the provided output, logs, errors, and screenshots.

PROJECT MEMORY:
${memoryContext}

RULES:
- Never claim work is complete without concrete evidence.
- Return a valid JSON object matching this schema:
{
  "status": "Completed" | "Partially completed" | "Not completed",
  "completed": ["string list of verified completed items"],
  "missing": ["string list of items that were requested but not done"],
  "broken": ["string list of bugs, syntax errors, or regressions found"],
  "evidence": ["string list of concrete proof found in logs or code"],
  "next_task": "string describing the exact immediate next task to assign to the Builder Agent"
}

Respond ONLY with the raw JSON object.`;
}
