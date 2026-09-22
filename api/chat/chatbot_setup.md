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

Edit `api/_lib/projects.ts` — add an entry per project you want the bot to talk about, each with a 1–3 sentence `summary` and its `githubRepo` if you want live stats available for it. Keep summaries short; they get sent to Gemini on every request that needs the routing decision, so bloating this file costs you tokens on every call.

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

## 6. What this does NOT include yet

- **Streaming** — right now it's request → full response. Fine for a first version; if answers feel slow, the `@google/genai` SDK supports `generateContentStream`, and you'd switch this to a streaming response (Vercel supports this on Edge or Node runtimes with some changes to the handler).
- **Persistent rate limiting / caching across cold starts** — both are in-memory right now, which only helps within a warm function instance. Fine to ship with; upgrade to Vercel KV or Upstash Redis (both free-tier) later if traffic grows or GitHub calls get frequent.
- **Jev-based routing** — the routing decision is currently made by Gemini's own function calling, exactly the fallback we discussed. If you get off the Jev waitlist, the swap point is `tools.ts`: instead of letting Gemini's `generateContent` call decide which function to invoke, you'd call Jev first with a `choice` output (`github_stats` | `project_info` | `general`) and use that to pick which tool to run directly — one less full LLM round-trip.

## 7. Cost check

At personal-site traffic (a handful to a few dozen visitors/day), this should run entirely within Gemini's free tier and Vercel's Hobby plan free tier. The only place cost could creep in is if a project gets hit with bot/scraper traffic — the basic rate limiter in `chat.ts` (10 req/min/IP) is there as a cheap first line of defense; tighten it or add Vercel's built-in Web Application Firewall rules if that becomes an issue.