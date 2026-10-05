import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { callOpenRouter, buildPlannerSystemPrompt } from '@/lib/ai/openrouter';
import { logger } from '@/lib/logger';

const CreatePlanSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  chatId: z.string().min(1, 'Chat ID is required'),
  model: z.string().default('google/gemini-2.5-flash'),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const parsed = CreatePlanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { projectId, chatId, model } = parsed.data;

    const project = await db.getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const memory = await db.getProjectMemory(projectId);
    const systemPrompt = buildPlannerSystemPrompt(memory, project.name);

    const userPrompt = `Please create a comprehensive, structured Project Plan for "${project.name}".
Original Idea:
${project.idea_text || 'No description provided'}

Include:
1. Executive Summary & Architecture Overview
2. Tech Stack recommendations
3. Database & Entity schema
4. Core UI views & Component hierarchy
5. Phased implementation milestones (Phase 1 MVP, Phase 2 Advanced, Phase 3 Polish)`;

    // Record user trigger in chat
    await db.createMessage({
      chat_id: chatId,
      chat_type: 'planner',
      role: 'user',
      content: 'Please create the official Project Plan for this application.',
    });

    const apiKey = await db.getActiveOpenRouterKey(user.id);
    const aiResponse = await callOpenRouter({
      apiKey,
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    // Save assistant message in chat
    const planMessage = await db.createMessage({
      chat_id: chatId,
      chat_type: 'planner',
      role: 'assistant',
      content: aiResponse.content,
      model_used: aiResponse.model,
      tokens_in: aiResponse.tokensIn,
      tokens_out: aiResponse.tokensOut,
    });

    // Save plan to Project Memory
    const memoryItem = await db.createProjectMemory({
      project_id: projectId,
      memory_type: 'decision',
      title: 'Approved Project Plan',
      content: aiResponse.content,
      source_chat_id: chatId,
      importance: 'high',
    });

    // Update project status to 'planned'
    await db.updateProject(projectId, { status: 'planned' });

    logger.info('Project plan generated and saved to memory', { projectId, chatId });
    return NextResponse.json({
      message: planMessage,
      memoryItem,
      projectStatus: 'planned',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error('Failed generating project plan', { error: errorMsg });
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
