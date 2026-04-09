'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type RegisterModalProps = { open: boolean; onClose: () => void };

const initialState = { fullName: '', phone: '', username: '', password: '', confirmPassword: '' };

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setError('');
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, open]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || 'Register gagal.');
      onClose();
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat register.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div className="modal-card auth-modal-card" role="dialog" aria-modal="true" aria-labelledby="register-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2 id="register-title">Register</h2>
            <p>Simpan akun baru langsung ke database.</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Tutup register">×</button>
        </div>

        <form className="form register-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Nama lengkap</label>
            <input id="fullName" value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} placeholder="Masukkan nama" />
          </div>

          <div className="field">
            <label htmlFor="phone">No. HP</label>
            <input id="phone" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Masukkan nomor HP" />
          </div>

          <div className="field">
            <label htmlFor="registerUsername">Username</label>
            <input id="registerUsername" value={form.username} onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))} placeholder="Minimal 3 karakter" required />
          </div>

          <div className="field">
            <label htmlFor="registerPassword">Password</label>
            <input id="registerPassword" type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="Minimal 6 karakter" required />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Konfirmasi password</label>
            <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))} placeholder="Ulangi password" required />
          </div>

          <div className="auth-actions auth-actions-stack">
            <button className="button" type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Register'}</button>
            <button className="button button-secondary" type="button" onClick={onClose}>Batal</button>
          </div>

          {error ? <div className="error">{error}</div> : null}
        </form>
      </div>
    </div>
  );
}
