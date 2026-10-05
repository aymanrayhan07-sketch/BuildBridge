import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { callOpenRouter, buildPlannerSystemPrompt } from '@/lib/ai/openrouter';
import { logger } from '@/lib/logger';

const PlannerChatSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  chatId: z.string().min(1, 'Chat ID is required'),
  message: z.string().min(1, 'Message is required'),
  model: z.string().default('google/gemini-2.5-flash'),
  screenshotUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const parsed = PlannerChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { projectId, chatId, message, model, screenshotUrl } = parsed.data;

    const project = await db.getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 1. Save user message
    const userMessageContent = screenshotUrl
      ? `${message}\n\n[Attached Screenshot: ${screenshotUrl}]`
      : message;

    const userMsg = await db.createMessage({
      chat_id: chatId,
      chat_type: 'planner',
      role: 'user',
      content: userMessageContent,
    });

    // 2. Fetch shared project memory
    const memory = await db.getProjectMemory(projectId);

    // 3. Fetch past messages for this specific chat
    const history = await db.getMessages(chatId);

    // 4. Construct messages array for LLM
    const systemPrompt = buildPlannerSystemPrompt(memory, project.name);
    const llmMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((h) => ({
        role: h.role,
        content: h.content,
      })),
    ];

    // 5. Get active OpenRouter API key
    const apiKey = await db.getActiveOpenRouterKey(user.id);

    // 6. Call OpenRouter
    const aiResponse = await callOpenRouter({
      apiKey,
      model,
      messages: llmMessages,
    });

    // 7. Save assistant message
    const assistantMsg = await db.createMessage({
      chat_id: chatId,
      chat_type: 'planner',
      role: 'assistant',
      content: aiResponse.content,
      model_used: aiResponse.model,
      tokens_in: aiResponse.tokensIn,
      tokens_out: aiResponse.tokensOut,
    });

    logger.info('Planner chat completed', { chatId, model: aiResponse.model });
    return NextResponse.json({ userMessage: userMsg, assistantMessage: assistantMsg });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error('Planner chat error', { error: errorMsg });
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
