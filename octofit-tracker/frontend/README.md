# OctoFit Tracker frontend

The React 19 presentation tier uses React Router to navigate between activity,
leaderboard, team, user, and workout views.

## API configuration

The frontend reads `VITE_CODESPACE_NAME` from Vite's environment. In a
Codespace, create `octofit-tracker/frontend/.env.local` and set it to the
Codespace name:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite uses this value to call
`https://<VITE_CODESPACE_NAME>-8000.app.github.dev`. When the variable is
unset, the frontend falls back to `http://localhost:8000` for local development.
Restart Vite after changing `.env.local`.

Run the presentation tier with:

```bash
npm run dev --prefix octofit-tracker/frontend
```
