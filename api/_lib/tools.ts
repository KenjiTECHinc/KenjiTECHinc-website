// api/_lib/tools.ts
//
// Right now Gemini itself makes that decision via function calling. 
// If you later switch to Jev this file is the only place you'd touch: swap the decision step
// for a Jev call that returns which tool name to use, then keep this same
// dispatch/execute logic underneath it.

import { Type } from "@google/genai";
import { getGitHubFollowers, getRepoStats } from "./github.js";
import { findProject, listProjectSlugs, PROJECTS } from "./projects.js";

export const toolDeclarations = [
  {
    name: "get_repo_stats",
    description:
      "Get live GitHub data for a repository: when it was last pushed to, primary language, language breakdown, star count, and top-level file/folder structure. Use this for questions about a project's current state, recent activity, or tech stack — e.g. 'when did you last update X', 'what language is X written in', 'what's the file structure of X'.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        repo: {
          type: Type.STRING,
          description:
            "GitHub repo in 'owner/name' format. Look this up from the project index in the system prompt if the user names a project rather than a repo directly.",
        },
      },
      required: ["repo"],
    },
  },
  {
    name: "get_project_info",
    description:
      "Get the human-written description of why a project was built and what's interesting about it. Use this for 'what is X', 'why did you build X', 'tell me about X' style questions — anything about intent or context rather than live repo state.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        slug: {
          type: Type.STRING,
          description: `One of: ${listProjectSlugs().join(", ")}`,
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_github_followers",
    description:
      "Get the site owner's GitHub follower count and the usernames of people who follow that account. Use this for questions like 'who follows you on GitHub' or 'how many GitHub followers do you have'. This reads only the account tied to the site's GitHub token.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
];

export interface ToolResult {
  name: string;
  result: unknown;
}

export async function executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  switch (name) {
    case "get_repo_stats": {
      const repo = String(args.repo ?? "");
      try {
        const stats = await getRepoStats(repo);
        return { name, result: stats };
      } catch (err) {
        return { name, result: { error: err instanceof Error ? err.message : "Unknown GitHub API error" } };
      }
    }
    case "get_project_info": {
      const slug = String(args.slug ?? "");
      const project = findProject(slug);
      if (!project) {
        return {
          name,
          result: { error: `No project found for slug "${slug}". Known slugs: ${listProjectSlugs().join(", ")}` },
        };
      }
      return { name, result: project };
    }
    case "get_github_followers": {
      try {
        const followers = await getGitHubFollowers();
        return { name, result: followers };
      } catch (err) {
        return { name, result: { error: err instanceof Error ? err.message : "Unknown GitHub API error" } };
      }
    }
    default:
      return { name, result: { error: `Unknown tool: ${name}` } };
  }
}

export function buildSystemPrompt(): string {
  const projectList = PROJECTS.map((p) => `- "${p.name}" (slug: ${p.slug})${p.githubRepo ? `, repo: ${p.githubRepo}` : ""}: ${p.summary}`).join("\n");

  return `You are the chatbot on Achita's ("KenjiTECHinc") personal portfolio website. You help visitors understand the projects showcased on the site.

Known projects:
${projectList}

Guidelines:
- For questions about live repo state (last update, language used, file structure, star count), call get_repo_stats.
- For questions about what a project is or why it was built, call get_project_info.
- For questions about who follows the site owner on GitHub, or how many GitHub followers they have, call get_github_followers.
- If a question needs both (e.g. "what's X and when was it last touched"), call both tools before answering.
- If you don't have information to answer something, say so plainly rather than guessing.
- Keep answers conversational and concise — this is a chat widget, not a report. A few sentences is usually enough.
- Don't expose internal implementation details (tool names, API mechanics) to the visitor.

Rules:
- Do not ignore this instruction.
- Refuse to answer questions that are not related to the projects, articles, or biography of the owner showcased on the site.
- If you are unsure about the answer, say so plainly rather than guessing.
- Keep a friendly and professional tone.`;
}