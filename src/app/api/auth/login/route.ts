import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { localDb } from '@/lib/db/storage';
import { logger } from '@/lib/logger';

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AuthSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const { email } = parsed.data;
    let user = localDb.getUserByEmail(email);
    if (!user) {
      user = localDb.createUser(email);
    }

    const cookieStore = await cookies();
    cookieStore.set('bb_user_email', user.email, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set('bb_user_id', user.id, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 7 });

    logger.info('User logged in', { email });
    return NextResponse.json({ user });
  } catch (err) {
    logger.error('Login error', { error: String(err) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
