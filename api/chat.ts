// api/chat.ts
//
// POST /api/chat
// Body: { message: string, history?: { role: "user" | "model", text: string }[] }
// Response: { reply: string }
//
// Flow: send the conversation + tool declarations to Gemini. If it asks to
// call a tool (get_repo_stats / get_project_info), run it and feed the
// result back. Repeat until Gemini returns a plain text answer.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import { toolDeclarations, executeTool, buildSystemPrompt } from "./_lib/tools.js";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const MAX_TOOL_ROUNDS = 4;
const MAX_HISTORY_TURNS = 12;
const MAX_TURN_CHARS = 2000;

// Warm-instance backstop only. This Map resets on a cold start and does not
// write to Vercel Runtime Cache. The durable limit is the Vercel Firewall
// rule on POST /api/chat (10 requests / 60 seconds per IP). See
// api/chat/chatbot_setup.md.
const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

function normalizeHistory(history: unknown): ChatMessage[] | undefined {
  if (history === undefined || history === null) return [];
  if (!Array.isArray(history)) return undefined;

  const turns: ChatMessage[] = [];
  for (const item of history) {
    if (!item || typeof item !== "object") return undefined;
    const record = item as Record<string, unknown>;
    if (record.role !== "user" && record.role !== "model") return undefined;
    if (typeof record.text !== "string") return undefined;
    turns.push({
      role: record.role,
      text: record.text.slice(0, MAX_TURN_CHARS),
    });
  }

  return turns.slice(-MAX_HISTORY_TURNS);
}

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many requests — please wait a moment." });
    return;
  }

  const body = req.body as { message?: unknown; history?: unknown } | undefined;
  const message = body?.message;
  const history = normalizeHistory(body?.history);

  if (!message || typeof message !== "string" || message.length > MAX_TURN_CHARS) {
    res.status(400).json({ error: "Missing message, or message too long (max 2000 chars)." });
    return;
  }

  if (!history) {
    res.status(400).json({ error: "History must be an array of { role, text } turns." });
    return;
  }

  try {
    const ai = getClient();

    const contents = [
      ...history.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const config = {
      systemInstruction: buildSystemPrompt(),
      tools: [{ functionDeclarations: toolDeclarations }],
    };

    let round = 0;
    let finalText: string | undefined;

    while (round < MAX_TOOL_ROUNDS) {
      round += 1;

      const response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config,
      });

      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts ?? [];
      const functionCalls = parts.filter((p) => p.functionCall).map((p) => p.functionCall!);

      if (functionCalls.length === 0) {
        finalText = response.text ?? "Sorry, I couldn't come up with an answer for that.";
        break;
      }

      // Append the model's function-call turn to the conversation, then run
      // each requested tool and append the results as a function-response turn.
      contents.push({ role: "model", parts } as any);

      const responseParts = [];
      for (const call of functionCalls) {
        const { name, result } = await executeTool(call.name ?? "", (call.args ?? {}) as Record<string, unknown>);
        responseParts.push({
          functionResponse: { name, response: { result } },
        });
      }
      contents.push({ role: "user", parts: responseParts } as any);
    }

    if (!finalText) {
      finalText = "I wasn't able to finish looking that up — try asking again, or rephrase the question.";
    }

    res.status(200).json({ reply: finalText });
  } catch (err) {
    console.error("chat handler error:", err);
    res.status(500).json({ error: "Something went wrong generating a response." });
  }
}