# Chatbot testing

Use this checklist to verify the chatbot backend and UI. `npm run dev` does **not** run Vercel functions, so `/api/chat` will 404 under Vite alone.

## Prerequisites

- `GEMINI_API_KEY` is set in Vercel project env vars and in a gitignored local `.env` / `.env.local` for `vercel dev`.
- `GITHUB_TOKEN` is recommended so live repo lookups are not capped at 60 requests/hour.
- From the repo root:

```bash
npx vercel dev
```

Confirm the app and `/api/chat` share the same origin in that process.

## API (curl)

Replace the origin if `vercel dev` prints a different port.

Valid message:

```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello\",\"history\":[]}"
```

Expect `{ "reply": "..." }`.

Empty body / missing message → 400:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{}"
```

Over 2000 characters → 400:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"$(python -c \"print('a'*2001)\")\"}"
```

## UI on `/agent`

1. Open `/agent`. The page should show the chat panel; the floating launcher should be hidden.
2. Send a short greeting. A user bubble appears immediately, then a model bubble with three bouncing dots until the reply arrives.
3. Send a follow-up that needs prior context (for example, “what did I just ask?”). The second request’s `history` must include the first turn so the reply stays coherent.

## Tool routing

Use the POC list in `api/_lib/projects.ts`:

| Question | Expected tool |
|---|---|
| What is Minesweep Plus? | `get_project_info` |
| When was KenjiTECHinc-website last updated? | `get_repo_stats` |
| Tell me about MICCAI 2025 SurgVU’s latest GitHub push | No live repo — SurgVU has no `githubRepo`. The bot should not invent stats. |

Replies should stay conversational and must not mention tool names.

## Widget

1. Open `/`. Click the floating launcher and send a message.
2. Navigate to `/agent` without refreshing. The full-page panel should show the same thread; the launcher should disappear.
3. Navigate back to `/` or `/projects`. The launcher returns and the thread is still there.

## Rate limit

The handler allows 10 requests per IP per minute (in-memory, per warm instance). Send 11 short messages quickly. The UI should show: `Too many requests — please wait a moment.`

## Production

After deploy:

1. Hard-refresh `/agent` (SPA rewrite in `vercel.json` should not 404).
2. Repeat one project-info question and one GitHub-stats question from the table above.
3. Confirm the floating launcher works on `/` and `/blogs`, and is hidden on `/agent`.
