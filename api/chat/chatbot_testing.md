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

## History cap

A non-array `history` returns 400:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello\",\"history\":{}}"
```

More than 12 turns is accepted. The handler keeps the latest 12 and slices each turn to 2000 characters instead of rejecting a long honest chat.

## Tool routing

Use the catalog in `api/_lib/projects.json`:

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

`chat.ts` still allows 10 requests per IP per minute on a warm instance. That counter resets on a cold start and does not use Runtime Cache. Send 11 short messages quickly against `vercel dev`. The UI should show: `Too many requests — please wait a moment.`

The durable limit is the Vercel Firewall rule in `chatbot_setup.md`: `POST /api/chat`, fixed window, 10 requests / 60 seconds per IP, action 429. Hobby allows one rate-limit rule per project. Also turn on Bot Protection in Challenge mode, and switch it to Log if that challenge blocks the same-origin widget.

## Production

After deploy, and after the Firewall rule is published:

1. Hard-refresh `/agent` (SPA rewrite in `vercel.json` should not 404).
2. Repeat one project-info question and one GitHub-stats question from the table above. Ask the GitHub question twice; the second lookup should reuse the cached repo stats.
3. Confirm the floating launcher works on `/` and `/blogs`, and is hidden on `/agent`.
4. Send a follow-up that needs prior context. The thread stays in the browser, and the reply stays coherent.
5. An 11th `POST /api/chat` within a minute returns 429 before Gemini. The widget shows the same too-many-requests message.
