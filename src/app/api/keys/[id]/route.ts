import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const success = await db.deleteApiKey(id, user.id);
    if (!success) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }
    logger.info('Deleted API key', { keyId: id });
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('Failed deleting API key', { error: String(err) });
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
}
