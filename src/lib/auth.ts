import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { localDb } from '@/lib/db/storage';
import { User } from '@/types';

export const DEMO_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo@buildbridge.dev',
  created_at: new Date(Date.now() - 7200000).toISOString(),
};

export async function getCurrentUser(): Promise<User> {
  const cookieStore = await cookies();
  const sessionUserEmail = cookieStore.get('bb_user_email')?.value;
  const sessionUserId = cookieStore.get('bb_user_id')?.value;

  if (sessionUserEmail && sessionUserId) {
    const existing = localDb.getUserById(sessionUserId);
    if (existing) return existing;
    return {
      id: sessionUserId,
      email: sessionUserEmail,
      created_at: new Date().toISOString(),
    };
  }

  // Check Supabase if configured
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && user.email) {
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at || new Date().toISOString(),
      };
    }
  } catch {
    // Supabase auth not connected, fallback to demo user
  }

  return DEMO_USER;
}
