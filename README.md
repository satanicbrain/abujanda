# Abu Janda - Next.js + Neon Ready

Project ini adalah starter app sederhana dengan:
- Login 2 kolom, clean, clear, minimalis, cerah
- Dummy user aktif: `abujanda` / `abujanda`
- Tombol `Login` + `Register` sejajar di halaman login
- Register popup langsung menyimpan akun ke Neon Database
- Dashboard ringan dan rapi
- Font global: `Courier New`
- Siap deploy ke Vercel

## 1) Install

```bash
npm install
```

## 2) Buat env lokal

Duplikat file `.env.example` menjadi `.env.local`

```bash
cp .env.example .env.local
```

Isi seperti ini:

```env
DATABASE_URL=postgresql://username:password@your-neon-host/your-database?sslmode=require
DUMMY_USERNAME=abujanda
DUMMY_PASSWORD=abujanda
AUTH_COOKIE_NAME=abujanda_session
```

## 3) Jalankan lokal

```bash
npm run dev
```

Buka `http://localhost:3000`

## 4) Login dummy

- Username: `abujanda`
- Password: `abujanda`

## 5) Register database

- Klik tombol `Register`
- Isi form popup
- Setelah submit berhasil, user langsung masuk dashboard
- Data user tersimpan di tabel `app_users`

## 6) Setup Neon manual (opsional)

Kalau mau siapkan tabel lebih dulu, jalankan isi file berikut di Neon SQL Editor:

```bash
database/init.sql
```

Route app juga akan mencoba membuat tabel otomatis saat login/register/ping database.

## 7) Deploy ke Vercel

1. Push project ke GitHub
2. Import repo ke Vercel
3. Tambahkan Environment Variable berikut:
   - `DATABASE_URL`
   - `DUMMY_USERNAME`
   - `DUMMY_PASSWORD`
   - `AUTH_COOKIE_NAME`
4. Deploy

## Struktur penting

- `app/login/page.tsx` → halaman login
- `app/login/_components/login-form.tsx` → form login + tombol register
- `app/login/_components/register-modal.tsx` → popup register
- `app/api/auth/login/route.ts` → login dummy + database
- `app/api/auth/register/route.ts` → register ke Neon
- `app/dashboard/page.tsx` → dashboard
- `app/globals.css` → styling utama
- `lib/db.ts` → helper Neon
- `lib/auth.ts` → auth + hash password
- `proxy.ts` → proteksi login/dashboard

## Catatan

- Kalau `DATABASE_URL` belum diisi, login dummy tetap jalan.
- User hasil register membutuhkan `DATABASE_URL` aktif.
- Gambar kiri login saat ini memakai `public/login-visual.png`.


## Penting jika update dari patch lama

Kalau sebelumnya project kamu masih punya file `middleware.ts`, **hapus file itu** dan pakai `proxy.ts` saja.

Contoh:

```bash
rm -f middleware.ts
```

Di Windows PowerShell:

```powershell
Remove-Item .\middleware.ts
```

Atau paling aman, ganti seluruh folder project dengan isi ZIP terbaru ini, jangan ditimpa setengah-setengah.


## Netlify quick fix

This package is prepared for Netlify:
- `.node-version` pins Node 20
- `.npmrc` points npm to the public npm registry
- `netlify.toml` sets the build command and Node version

If you previously pushed a `package-lock.json` generated from a private/internal registry, remove it from your repo before redeploying.
