import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { registerUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string; confirmPassword?: string; fullName?: string; phone?: string };
    const username = body.username?.trim() || '';
    const password = body.password?.trim() || '';
    const confirmPassword = body.confirmPassword?.trim() || '';
    const fullName = body.fullName?.trim() || '';
    const phone = body.phone?.trim() || '';

    if (username.length < 3) return NextResponse.json({ ok: false, message: 'Username minimal 3 karakter.' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ ok: false, message: 'Password minimal 6 karakter.' }, { status: 400 });
    if (password != confirmPassword) return NextResponse.json({ ok: false, message: 'Konfirmasi password tidak sama.' }, { status: 400 });

    const result = await registerUser({ username, password, fullName, phone });
    if (!result.ok) return NextResponse.json(result, { status: 400 });

    const response = NextResponse.json(result);
    response.cookies.set(AUTH_COOKIE_NAME, 'logged-in', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: 'Request register tidak valid.' }, { status: 400 });
  }
}
