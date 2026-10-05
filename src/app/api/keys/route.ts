import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

const CreateKeySchema = z.object({
  provider: z.string().default('openrouter'),
  key: z.string().min(8, 'API key must be at least 8 characters long'),
  label: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    const keys = await db.getApiKeys(user.id);
    // Returns masked keys only
    return NextResponse.json({ keys });
  } catch (err) {
    logger.error('Failed fetching API keys', { error: String(err) });
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const parsed = CreateKeySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid key' }, { status: 400 });
    }

    const { provider, key, label } = parsed.data;
    const createdKey = await db.createApiKey(user.id, provider, key, label);

    logger.info('Saved user API key securely', { provider, label });
    // Returns only masked key in response
    return NextResponse.json({ key: createdKey }, { status: 201 });
  } catch (err) {
    logger.error('Failed saving API key', { error: String(err) });
    return NextResponse.json({ error: 'Failed to save API key' }, { status: 500 });
  }
}
