# Daraz Clone

This repo now has both the frontend and a backend that can run in two modes:

- local JSON mode
- Supabase mode for auth, OAuth, tables, and storage

## Frontend

Create a root `.env` file with:

```env
VITE_API_URL=http://localhost:9005
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Run:

```bash
npm install
npm run dev
```

## Backend

The backend lives in [`server/`](/Users/surazkhati/Desktop/Daraz-clone--main/server).

Example backend env:

```env
PORT=9005
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-secure-secret
REFRESH_SECRET=replace-with-a-different-secure-secret
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=site-assets
```

Run:

```bash
npm run server
```

Or directly:

```bash
cd server
npm install
npm start
```

## Included API

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/profile/sync`
- `GET /auth/activate/:token`
- `GET /auth/resend-activationtoken/:token`
- `GET /banner/list-home`
- banner admin CRUD
- brand admin CRUD
- `GET /chat/list`

## Supabase setup

Run the schema in [schema.sql](/Users/surazkhati/Desktop/Daraz-clone--main/supabase/schema.sql).

In Supabase Auth:

- enable Email provider
- enable Google provider
- set site URL to `http://localhost:5173`
- add redirect URL `http://localhost:5173/auth/callback`

In Supabase Storage:

- create bucket `site-assets`

## Seeded Accounts

- Admin: `admin@demo.com` / `Admin@123`
- Seller: `seller@demo.com` / `Seller@123`

## Storage

- JSON data: `server/data/db.json`
- Uploaded files: `server/uploads/`
