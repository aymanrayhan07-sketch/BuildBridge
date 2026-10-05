import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

const AgentOutputSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  agentChatId: z.string().min(1, 'Agent Chat ID is required'),
  content: z.string().min(1, 'Agent output text is required'),
  artifactType: z.enum(['output', 'log', 'file_list']).default('output'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AgentOutputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { projectId, agentChatId, content, artifactType } = parsed.data;

    // 1. Save artifact
    const artifact = await db.createAgentArtifact({
      project_id: projectId,
      agent_chat_id: agentChatId,
      artifact_type: artifactType,
      content,
    });

    // 2. Add message to agent chat
    await db.createMessage({
      chat_id: agentChatId,
      chat_type: 'agent',
      role: 'user',
      content: `[Imported Agent ${artifactType.toUpperCase()}]:\n\n${content}`,
    });

    // 3. Automatically create/update Project Memory summary
    const summarySnippet = content.length > 200 ? `${content.slice(0, 200)}...` : content;
    const memoryItem = await db.createProjectMemory({
      project_id: projectId,
      memory_type: 'progress',
      title: 'Builder Agent Output Imported',
      content: `Agent output imported (${artifactType}): "${summarySnippet}"`,
      source_chat_id: agentChatId,
      importance: 'normal',
    });

    // 4. Update project status to 'needs review'
    await db.updateProject(projectId, { status: 'needs review' });

    logger.info('Agent output imported and memory updated', { projectId, artifactId: artifact.id });
    return NextResponse.json({
      artifact,
      memoryItem,
      projectStatus: 'needs review',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error('Failed importing agent output', { error: errorMsg });
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
