# Chatbot service setup

## 1. Where these files go

Drop these straight into your repo, same paths:

```
api/
  chat.ts
  _lib/
    tools.ts
    github.ts
    projects.ts
    projects.json
```

This slots in next to whatever's already in your `api/` folder — no changes to your Vite build config needed, Vercel picks up `api/*.ts` as serverless functions automatically.

## 2. Install dependencies

```bash
npm install @google/genai
npm install -D @vercel/node
```

## 3. Environment variables

Set these in Vercel (Project Settings → Environment Variables), and also in a local `.env` (gitignored) for `vercel dev`:

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | Yes | From Google AI Studio. Free tier is generous for a personal site's traffic. |
| `GITHUB_TOKEN` | Recommended | Classic PAT, `public_repo` scope only. Without it you're capped at 60 GitHub API requests/hr; with it, 5000/hr. |
| `GEMINI_MODEL` | No | Defaults to `gemini-flash-latest` (Google's alias that always points to the current Flash model, so you don't have to chase version strings). |

## 4. Fill in your project data

Edit `api/_lib/projects.json` — add an entry per project you want the bot to talk about, each with a 1–3 sentence `summary` and its `githubRepo` if you want live stats available for it. `projects.ts` imports that file statically, so the catalog is bundled at build time. Keep summaries short; they get sent to Gemini on every request that needs the routing decision, so bloating this file costs you tokens on every call. This file is separate from `src/data/projects.json`, which feeds the portfolio page.

## 5. Calling it from your frontend

```ts
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: userInput,
    history: previousMessages, // [{ role: "user" | "model", text: string }]
  }),
});
const { reply } = await res.json();
```

Since it's same-origin (`/api/chat` on your own Vercel deployment), no CORS config needed.

## 6. Caching and abuse limits

- **GitHub stats** are stored in Vercel Runtime Cache for 15 minutes under `kenjitechinc:repo-stats:{owner/repo}`. Only successful lookups are cached. Chat transcripts are not stored there; the browser keeps the thread and sends it back as `history`.
- **History cap** — the handler keeps the latest 12 turns and slices each turn to 2000 characters. A non-array `history`, or a turn that is not `{ role: "user" | "model", text: string }`, returns 400. The latest `message` still 400s when it is missing or longer than 2000 characters.
- **In-memory limiter** in `chat.ts` (10 requests / 60 seconds per IP) is only a warm-instance backstop. It resets on a cold start and does not write to Runtime Cache.
- **Vercel Firewall** is the limit that survives cold starts. Hobby includes one rate-limit rule per project. In the project Firewall settings, add a custom rule:
  - Condition: request path equals `/api/chat` and method is `POST`
  - Action: Rate limit, fixed window, 10 requests per 60 seconds, key = IP, response = 429
  - Publish the rule. Blocked requests are stopped before the function runs, so they are not billed and never call Gemini.
- **Bot Protection** managed ruleset: turn it on in Challenge mode so non-browser clients are challenged. The widget is a same-origin browser `fetch`, so it should pass. If Challenge blocks the widget, switch that ruleset to Log and leave the path rate limit in place. Rate-limit counters are tracked per edge region.
- **Streaming** is not included. The `@google/genai` SDK supports `generateContentStream` if answers feel slow.
- **Jev-based routing** is not included. The routing decision is Gemini function calling. If you switch, the swap point is `tools.ts`.

## 7. Cost check

At personal-site traffic (a handful to a few dozen visitors/day), this should run entirely within Gemini's free tier and Vercel's Hobby plan. Runtime Cache is only written when a repo's stats miss the 15-minute cache, which is a few writes per hour, not one write per chat message. Do not store sessions or rate-limit counters in Runtime Cache: Hobby cannot buy overage, and a bot that forced a cache write on every request could pause the project.