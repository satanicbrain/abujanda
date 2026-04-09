import { neon } from '@neondatabase/serverless';
import { hashPassword, verifyPassword } from './auth';

export type DashboardSummary = {
  appName: string;
  mode: 'demo' | 'neon';
  stats: {
    totalData: number;
    queriesToday: number;
    onlineUsers: number;
  };
  latestActivity: Array<{
    title: string;
    description: string;
    time: string;
  }>;
};

type UserRow = {
  id: number;
  username: string;
  password_hash: string;
};

const fallbackSummary: DashboardSummary = {
  appName: 'Abu Janda',
  mode: 'demo',
  stats: { totalData: 128, queriesToday: 17, onlineUsers: 3 },
  latestActivity: [
    { title: 'Dummy login aktif', description: 'User abujanda berhasil diarahkan ke dashboard.', time: 'Baru saja' },
    { title: 'Neon siap dipakai', description: 'Isi DATABASE_URL untuk mengambil data real dari Neon.', time: 'Setup awal' },
    { title: 'UI minimalis aktif', description: 'Tampilan clean, clear, cerah, dan sederhana sudah siap.', time: 'Template' },
  ],
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  return neon(databaseUrl);
}

export async function ensureCoreTables() {
  const sql = getSql();
  if (!sql) return false;

  await sql`create table if not exists public.app_notes (
    id serial primary key,
    title text not null,
    description text,
    created_at timestamptz not null default now()
  )`;

  await sql`create table if not exists public.app_users (
    id serial primary key,
    username text not null unique,
    password_hash text not null,
    full_name text,
    phone text,
    created_at timestamptz not null default now()
  )`;

  return true;
}

export async function registerUser(input: { username: string; password: string; fullName?: string; phone?: string }) {
  const sql = getSql();
  if (!sql) {
    return { ok: false as const, message: 'DATABASE_URL belum diisi. Register database belum aktif.' };
  }

  await ensureCoreTables();

  const existing = (await sql`select id from public.app_users where lower(username) = lower(${input.username}) limit 1`) as Array<{ id: number }>;
  if (existing.length > 0) {
    return { ok: false as const, message: 'Username sudah dipakai.' };
  }

  const passwordHash = hashPassword(input.password);
  await sql`insert into public.app_users (username, password_hash, full_name, phone)
    values (${input.username}, ${passwordHash}, ${input.fullName || null}, ${input.phone || null})`;
  await sql`insert into public.app_notes (title, description)
    values (${'User baru terdaftar'}, ${`Username ${input.username} berhasil register melalui form login.`})`;

  return { ok: true as const, message: 'Register berhasil. Akun sudah tersimpan di database.' };
}

export async function verifyDatabaseUser(username: string, password: string) {
  const sql = getSql();
  if (!sql) return { ok: false as const, reason: 'DATABASE_URL belum diisi.' };

  await ensureCoreTables();
  const rows = (await sql`select id, username, password_hash from public.app_users where lower(username) = lower(${username}) limit 1`) as UserRow[];
  const user = rows[0];
  if (!user) return { ok: false as const, reason: 'User tidak ditemukan.' };
  const valid = verifyPassword(password, user.password_hash);
  if (!valid) return { ok: false as const, reason: 'Password tidak cocok.' };
  return { ok: true as const, username: user.username };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const sql = getSql();
  if (!sql) return fallbackSummary;

  try {
    await ensureCoreTables();
    const countRows = (await sql`select count(*)::text as count from app_notes`) as Array<{ count: string }>;
    const [{ count }] = countRows;
    const latestActivityRows = (await sql`select title, description, created_at::text from app_notes order by created_at desc limit 3`) as Array<{ title: string; description: string | null; created_at: string }>;

    return {
      appName: 'Abu Janda',
      mode: 'neon',
      stats: { totalData: Number(count ?? 0), queriesToday: Number(count ?? 0) + 4, onlineUsers: 1 },
      latestActivity: latestActivityRows.length > 0 ? latestActivityRows.map((row) => ({ title: row.title, description: row.description || 'Catatan tersimpan di Neon.', time: row.created_at })) : [{ title: 'Database terhubung', description: 'Neon sudah connect, tapi tabel masih kosong.', time: 'Sekarang' }],
    };
  } catch {
    return {
      ...fallbackSummary,
      latestActivity: [
        { title: 'Koneksi Neon gagal', description: 'Cek kembali DATABASE_URL di file .env.local.', time: 'Perlu pengecekan' },
        ...fallbackSummary.latestActivity.slice(0, 2),
      ],
    };
  }
}

export async function pingDatabase() {
  const sql = getSql();
  if (!sql) return { ok: false, mode: 'demo', message: 'DATABASE_URL belum diisi.' };

  try {
    await ensureCoreTables();
    const result = (await sql`select now()::text as now`) as Array<{ now: string }>;
    return { ok: true, mode: 'neon', message: 'Koneksi Neon berhasil.', time: result[0]?.now ?? null };
  } catch {
    return { ok: false, mode: 'neon', message: 'Koneksi Neon gagal. Periksa DATABASE_URL.' };
  }
}
