# Deployment instructions — Render (backend) + Vercel (frontend)

This document describes how to deploy the backend to Render and the frontend to Vercel.

1) Prerequisites
  - Github repository: https://github.com/iteeagarwal05/Itee-Blog
  - A Render account (https://render.com)
  - A Vercel account (https://vercel.com)

2) What I added to the repo
  - `render.yaml` — a minimal Render manifest pointing to `backend/` so Render can build and start the server.
  - `frontend/vercel.json` — minimal Vercel configuration for a Vite build.
  - `frontend/src/services/*` — changed to use `import.meta.env.VITE_API_URL` when available.

3) Backend (Render)
  - In the Render dashboard, click "New" → "Web Service" → Connect to GitHub → choose `iteeagarwal05/Itee-Blog`.
  - Render will detect `render.yaml` and create the `itee-blog-backend` service with root `backend`.
  - IMPORTANT: Configure the following environment variables in Render (Service → Environment):
    - `MONGODB_URI` (or `DATABASE_URL`) — your MongoDB connection string
    - `JWT_SECRET` — secret used for signing tokens
    - `NODE_ENV` = `production`
    - `CLIENT_ORIGIN` — your frontend URL (after Vercel deploy), e.g. `https://your-frontend.vercel.app`
  - Optionally set `PORT` (Render sets this automatically via $PORT; the app falls back to 3000 if not present).
  - Deploy; Render will run `npm install` in `backend` and `npm start` to run `node index.js`.

4) Frontend (Vercel)
  - In Vercel, import the GitHub repository `iteeagarwal05/Itee-Blog` and select the `frontend` directory as the project's root.
  - In the Vercel project settings → Environment Variables, add:
    - `VITE_API_URL` = the backend URL served by Render, e.g. `https://itee-blog-backend.onrender.com`
  - Vercel will use `npm run build` (build command) and publish the `dist` directory. The included `vercel.json` ensures the `dist` directory is used.
  - After deployment, copy the frontend URL and set `CLIENT_ORIGIN` in Render to that value to allow CORS.

5) Notes & tips
  - For local development, the frontend still falls back to `http://localhost:3000` for API calls.
  - Make sure your MongoDB instance accepts connections from Render (if using Mongo Atlas, add Render's IP ranges or use 0.0.0.0/0 for testing).
  - Keep secrets (DB URI, JWT secret) only in Render/Vercel environment variable settings — do not commit them.

6) Verification
  - Backend: visit the Render service URL + `/api/v1/blogs` and confirm you get a JSON response.
  - Frontend: visit the Vercel URL and verify the site loads and fetches articles.

If you want, I can also:
- Create a Render web service via the Render API (requires an API key) — I will need the Render API key and permission to create services.
- Create a Vercel project via the Vercel CLI/API (requires a token) and set environment variables automatically.
