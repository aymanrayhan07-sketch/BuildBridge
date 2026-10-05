import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { callOpenRouter, buildReviewSystemPrompt } from '@/lib/ai/openrouter';
import { logger } from '@/lib/logger';
import { ReviewResult } from '@/types';

const ReviewOutputSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  chatId: z.string().min(1, 'Chat ID is required'),
  agentChatId: z.string().optional(),
  agentOutput: z.string().min(1, 'Agent output is required'),
  errors: z.string().optional(),
  screenshotUrl: z.string().optional(),
  model: z.string().default('google/gemini-2.5-flash'),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const parsed = ReviewOutputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { projectId, chatId, agentChatId, agentOutput, errors, screenshotUrl, model } = parsed.data;

    const project = await db.getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const memory = await db.getProjectMemory(projectId);
    const systemPrompt = buildReviewSystemPrompt(memory);

    const promptText = `Please review this Builder Agent output for project "${project.name}".

ORIGINAL REQUIREMENT:
${project.idea_text || 'Build feature per prompt'}

AGENT OUTPUT & LOGS:
${agentOutput}

${errors ? `AGENT ERRORS / CONSOLE OUTPUT:\n${errors}\n` : ''}
${screenshotUrl ? `SCREENSHOT ATTACHED:\n${screenshotUrl}\n` : ''}

Remember to return ONLY a JSON object:
{
  "status": "Completed" | "Partially completed" | "Not completed",
  "completed": ["item 1", "item 2"],
  "missing": ["item 1"],
  "broken": ["item 1"],
  "evidence": ["item 1"],
  "next_task": "next step"
}`;

    const apiKey = await db.getActiveOpenRouterKey(user.id);
    const aiResponse = await callOpenRouter({
      apiKey,
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: promptText },
      ],
      temperature: 0.2,
    });

    let reviewResult: ReviewResult;
    try {
      // Find JSON block if response contains markdown
      let jsonStr = aiResponse.content.trim();
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
      }
      reviewResult = JSON.parse(jsonStr);
    } catch {
      // Graceful parsing fallback
      reviewResult = {
        status: 'Partially completed',
        completed: ['Code artifacts received from builder agent'],
        missing: ['Full automated test verification'],
        broken: errors ? [errors] : [],
        evidence: [agentOutput.slice(0, 150) + '...'],
        next_task: 'Address any missing requirements and run a visual check.',
      };
    }

    // Determine status badge
    const newStatus =
      reviewResult.status === 'Completed'
        ? 'completed'
        : reviewResult.status === 'Partially completed'
        ? 'needs fix'
        : 'needs fix';

    await db.updateProject(projectId, { status: newStatus });

    // Format review message for chat
    const formattedReviewMessage = `### 🔍 Agent Output Review: **${reviewResult.status}**

**Evidence Found:**
${reviewResult.evidence.map((e) => `- ✅ ${e}`).join('\n') || '- None recorded'}

**Completed:**
${reviewResult.completed.map((c) => `- ✓ ${c}`).join('\n') || '- None'}

**Missing / Incomplete:**
${reviewResult.missing.map((m) => `- ⚠️ ${m}`).join('\n') || '- None'}

**Broken / Errors:**
${reviewResult.broken.map((b) => `- ❌ ${b}`).join('\n') || '- None reported'}

**Next Recommended Task:**
> 🎯 ${reviewResult.next_task}`;

    // Record user trigger in chat
    await db.createMessage({
      chat_id: chatId,
      chat_type: 'planner',
      role: 'user',
      content: 'Please review the latest Builder Agent output.',
    });

    const assistantMsg = await db.createMessage({
      chat_id: chatId,
      chat_type: 'planner',
      role: 'assistant',
      content: formattedReviewMessage,
      model_used: aiResponse.model,
      tokens_in: aiResponse.tokensIn,
      tokens_out: aiResponse.tokensOut,
    });

    // Save to Project Memory
    const memoryItem = await db.createProjectMemory({
      project_id: projectId,
      memory_type: 'progress',
      title: `Agent Review: ${reviewResult.status}`,
      content: `Status: ${reviewResult.status}. Next recommended: ${reviewResult.next_task}. Completed: ${reviewResult.completed.join('; ')}`,
      source_chat_id: agentChatId || chatId,
      importance: reviewResult.status === 'Completed' ? 'normal' : 'high',
    });

    // If there are broken items, also log to memory as issue
    if (reviewResult.broken.length > 0) {
      await db.createProjectMemory({
        project_id: projectId,
        memory_type: 'issue',
        title: 'Review Issues Detected',
        content: reviewResult.broken.join('; '),
        source_chat_id: agentChatId || chatId,
        importance: 'high',
      });
    }

    logger.info('Output review completed', { projectId, status: reviewResult.status });
    return NextResponse.json({
      review: reviewResult,
      message: assistantMsg,
      memoryItem,
      projectStatus: newStatus,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error('Failed reviewing agent output', { error: errorMsg });
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
