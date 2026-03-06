# Overview

This simple app is a proof of concept that connects a Supabase backend through FastAPI to a Svelte 5 frontend. The backend is deployed through Render. The frontend is deployed through Vercel.

https://svelte-fast-api.vercel.app/

## Config Notes

The app is a simple monorepo with backend and frontend dirs. Deployment platforms must be configured with root directories that match the backend and frontend/fast dirs.

Deployment platforms must be configured with environment variables.

Added CORSMiddleware to main.py.

## Dev Notes

Added this to settings.json: "python.terminal.useEnvFile": true,
On Supabase, I had to create a data policy to enable read access for all users.

Split terminal:

Python venv:

```
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

To stop the Python terminal:
Ctrl + C
`deactivate`

Svelte (in the app dir):
`pnpm run dev --open`
