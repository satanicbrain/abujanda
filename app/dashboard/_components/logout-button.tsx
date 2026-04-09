'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
    setLoading(false);
  }

  return (
    <button className="logout-button" type="button" onClick={handleLogout} disabled={loading}>
      {loading ? 'Keluar...' : 'Logout'}
    </button>
  );
}
