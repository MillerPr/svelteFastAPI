# Notes

Added this to settings.json: "python.terminal.useEnvFile": true,
On Supabase, I had to create a data policy to enable read access for all users.
Split terminal:

To launch the Python venv:
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

To stop the Python terminal:
Ctrl + C
deactivate

Svelte (in the app dir): pnpm run dev --open
