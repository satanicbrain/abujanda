import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, isValidDummyUser } from '@/lib/auth';
import { verifyDatabaseUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = body.username?.trim() || '';
    const password = body.password?.trim() || '';

    const isDummy = isValidDummyUser(username, password);
    const databaseUser = isDummy ? { ok: false as const } : await verifyDatabaseUser(username, password);

    if (!isDummy && !databaseUser.ok) {
      return NextResponse.json({ ok: false, message: 'Username atau password salah.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, message: 'Login berhasil.' });
    response.cookies.set(AUTH_COOKIE_NAME, 'logged-in', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: 'Request login tidak valid.' }, { status: 400 });
  }
}
