import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { callOpenRouter, buildNextPromptSystemPrompt } from '@/lib/ai/openrouter';
import { logger } from '@/lib/logger';

const NextPromptSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  chatId: z.string().min(1, 'Chat ID is required'),
  agentChatId: z.string().min(1, 'Agent Chat ID is required'),
  model: z.string().default('google/gemini-2.5-flash'),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const parsed = NextPromptSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { projectId, chatId, agentChatId, model } = parsed.data;

    const project = await db.getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const memory = await db.getProjectMemory(projectId);

    // Build system prompt for prompt architect
    const systemPrompt = buildNextPromptSystemPrompt(memory);

    const promptRequest = `Please generate the next immediate, small, and clearly scoped coding prompt for the Builder Agent on "${project.name}".
Ensure it specifies:
1. Current project context
2. Exact task
3. Files to create or modify
4. Constraints
5. What not to do
6. "Done when" acceptance criteria`;

    // Record user trigger in chat
    await db.createMessage({
      chat_id: chatId,
      chat_type: 'planner',
      role: 'user',
      content: 'Please generate the next Builder Agent prompt.',
    });

    const apiKey = await db.getActiveOpenRouterKey(user.id);
    const aiResponse = await callOpenRouter({
      apiKey,
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: promptRequest },
      ],
      temperature: 0.3,
    });

    // Save prompt to agent_prompts table
    const agentPrompt = await db.createAgentPrompt({
      project_id: projectId,
      agent_chat_id: agentChatId,
      prompt_text: aiResponse.content,
      status: 'ready',
    });

    // Notify in Planner Chat
    const assistantMsg = await db.createMessage({
      chat_id: chatId,
      chat_type: 'planner',
      role: 'assistant',
      content: `I have generated the next Builder Agent prompt and loaded it into the Builder Agent Workspace (Session prompt ready):\n\n\`\`\`text\n${aiResponse.content}\n\`\`\`\n\nYou can copy this prompt from the right-hand panel and paste it into Cline, Codex, Antigravity, or Claude Code.`,
      model_used: aiResponse.model,
      tokens_in: aiResponse.tokensIn,
      tokens_out: aiResponse.tokensOut,
    });

    // Update project status to 'prompt ready'
    await db.updateProject(projectId, { status: 'prompt ready' });

    // Save note in Project Memory
    await db.createProjectMemory({
      project_id: projectId,
      memory_type: 'progress',
      title: 'Builder Agent Prompt Generated',
      content: `Prepared prompt for agent session: "${aiResponse.content.slice(0, 100)}..."`,
      source_chat_id: agentChatId,
      importance: 'normal',
    });

    logger.info('Next prompt generated and stored', { projectId, promptId: agentPrompt.id });
    return NextResponse.json({
      prompt: agentPrompt,
      message: assistantMsg,
      projectStatus: 'prompt ready',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error('Failed generating next prompt', { error: errorMsg });
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
