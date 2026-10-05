import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

const CreateMessageSchema = z.object({
  chat_id: z.string().min(1, 'Chat ID is required'),
  chat_type: z.enum(['planner', 'agent']),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  model_used: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    if (!chatId) {
      return NextResponse.json({ error: 'chatId is required' }, { status: 400 });
    }
    const messages = await db.getMessages(chatId);
    return NextResponse.json({ messages });
  } catch (err) {
    logger.error('Failed fetching messages', { error: String(err) });
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid message payload' }, { status: 400 });
    }
    const msg = await db.createMessage(parsed.data);
    return NextResponse.json({ message: msg }, { status: 201 });
  } catch (err) {
    logger.error('Failed creating message', { error: String(err) });
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
