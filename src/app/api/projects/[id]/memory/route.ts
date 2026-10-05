import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memory = await db.getProjectMemory(id);
    return NextResponse.json({ memory });
  } catch (err) {
    logger.error('Failed fetching project memory', { error: String(err) });
    return NextResponse.json({ error: 'Failed to fetch project memory' }, { status: 500 });
  }
}
