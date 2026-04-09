create table if not exists public.app_notes (
  id serial primary key,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.app_users (
  id serial primary key,
  username text not null unique,
  password_hash text not null,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

insert into public.app_notes (title, description)
values
  ('Dashboard siap', 'Project awal Abu Janda berhasil dibuat.'),
  ('Neon terkoneksi', 'Isi DATABASE_URL lalu jalankan query ini untuk seed data awal.'),
  ('UI minimalis aktif', 'Font Courier New dan layout cerah sudah diterapkan.');
