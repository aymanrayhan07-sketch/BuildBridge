import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

const CreateAgentChatSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  title: z.string().min(1, 'Title is required'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }
    const chats = await db.getAgentChats(projectId);
    return NextResponse.json({ chats });
  } catch (err) {
    logger.error('Failed fetching agent chats', { error: String(err) });
    return NextResponse.json({ error: 'Failed to fetch agent chats' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateAgentChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Valid projectId and title required' }, { status: 400 });
    }
    const { projectId, title } = parsed.data;
    const chat = await db.createAgentChat(projectId, title);
    logger.info('Created new agent chat', { chatId: chat.id, projectId });
    return NextResponse.json({ chat }, { status: 201 });
  } catch (err) {
    logger.error('Failed creating agent chat', { error: String(err) });
    return NextResponse.json({ error: 'Failed to create agent chat' }, { status: 500 });
  }
}
