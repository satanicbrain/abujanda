'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterModal from './register-modal';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('username');
  const [password, setPassword] = useState('*******');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registerOpen, setRegisterOpen] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || 'Login gagal.');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Masukkan username" />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" />
        </div>

        <div className="auth-actions">
          <button className="button" type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Login'}</button>
          <button className="button button-secondary" type="button" onClick={() => setRegisterOpen(true)}>Register</button>
        </div>

        {error ? <div className="error">{error}</div> : null}
      </form>

      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
}
