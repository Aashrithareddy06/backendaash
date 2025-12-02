# Backend — Render Deployment

This repository contains a minimal Node/Express backend prepared for deployment to Render.

Quick notes:
- The app entrypoint is `src/server.js` and reads configuration from environment variables.
- Do not commit `.env` (this repo's `.gitignore` already ignores it).

Required environment variables (set these in Render -> Service -> Environment):
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

Basic Render deploy steps:
1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Render, create a new **Web Service** and connect your repo.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables in Render's Environment settings.

Local test:
```
cd <repo>
npm install
npm start
```
