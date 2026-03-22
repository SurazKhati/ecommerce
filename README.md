# Daraz Clone

This repo now has both the frontend and a simple backend that matches the current React app.

## Frontend

Create a root `.env` file with:

```env
VITE_API_URL=http://localhost:9005
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
CLIENT_URL=http://localhost:5174
JWT_SECRET=replace-with-a-secure-secret
REFRESH_SECRET=replace-with-a-different-secure-secret
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
- `GET /auth/activate/:token`
- `GET /auth/resend-activationtoken/:token`
- `GET /banner/list-home`
- banner admin CRUD
- brand admin CRUD
- `GET /chat/list`

## Seeded Accounts

- Admin: `admin@demo.com` / `Admin@123`
- Seller: `seller@demo.com` / `Seller@123`

## Storage

- JSON data: `server/data/db.json`
- Uploaded files: `server/uploads/`
