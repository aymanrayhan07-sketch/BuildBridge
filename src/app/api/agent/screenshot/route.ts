import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

const AgentScreenshotSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  agentChatId: z.string().min(1, 'Agent Chat ID is required'),
  fileUrl: z.string().min(1, 'File URL or base64 image data is required'),
  caption: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AgentScreenshotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { projectId, agentChatId, fileUrl, caption } = parsed.data;

    // 1. Save artifact
    const artifact = await db.createAgentArtifact({
      project_id: projectId,
      agent_chat_id: agentChatId,
      artifact_type: 'screenshot',
      file_url: fileUrl,
      content: caption || 'Screenshot evidence from Builder Agent',
    });

    // 2. Add message to agent chat
    await db.createMessage({
      chat_id: agentChatId,
      chat_type: 'agent',
      role: 'user',
      content: `[Attached Screenshot Evidence]${caption ? `: ${caption}` : ''}`,
    });

    // 3. Automatically create/update Project Memory summary
    const memoryItem = await db.createProjectMemory({
      project_id: projectId,
      memory_type: 'progress',
      title: 'Screenshot Evidence Uploaded',
      content: `Screenshot recorded for verification. Caption: "${caption || 'Visual inspection'}"`,
      source_chat_id: agentChatId,
      importance: 'normal',
    });

    // 4. Update status
    await db.updateProject(projectId, { status: 'needs review' });

    logger.info('Screenshot artifact saved and memory updated', { projectId, artifactId: artifact.id });
    return NextResponse.json({
      artifact,
      memoryItem,
      projectStatus: 'needs review',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error('Failed uploading screenshot', { error: errorMsg });
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
