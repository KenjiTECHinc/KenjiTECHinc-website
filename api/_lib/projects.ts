// api/_lib/projects.ts
//
// Loads the chatbot project catalog from projects.json. That file is imported
// statically, so Vercel bundles it into the function at build time. It is not
// fetched on each request and it is not stored in Runtime Cache.
//
// Keep each summary to a paragraph or two. Do NOT dump a whole README in
// here; that bloats every request's token cost. This catalog is separate
// from src/data/projects.json, which feeds the portfolio page.

import rawProjects from "./projects.json" with { type: "json" };

export interface ProjectInfo {
  slug: string;
  name: string;
  githubRepo?: string;
  summary: string;
  tags?: string[];
}

function isProjectInfo(value: unknown): value is ProjectInfo {
  if (!value || typeof value !== "object") return false;
  const project = value as Record<string, unknown>;
  if (typeof project.slug !== "string" || project.slug.length === 0) return false;
  if (typeof project.name !== "string" || project.name.length === 0) return false;
  if (typeof project.summary !== "string" || project.summary.length === 0) return false;
  if (project.githubRepo !== undefined && typeof project.githubRepo !== "string") return false;
  if (
    project.tags !== undefined &&
    (!Array.isArray(project.tags) || project.tags.some((tag) => typeof tag !== "string"))
  ) {
    return false;
  }
  return true;
}

if (!Array.isArray(rawProjects) || rawProjects.length === 0 || !rawProjects.every(isProjectInfo)) {
  throw new Error("api/_lib/projects.json is not a valid project catalog");
}

export const PROJECTS: ProjectInfo[] = rawProjects;

export function findProject(slug: string): ProjectInfo | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function listProjectSlugs(): string[] {
  return PROJECTS.map((project) => project.slug);
}

// Gives the model a lightweight index of what projects exist, so it can pick
// a slug for the get_project_info tool without you hardcoding the mapping
// into the system prompt every time you add a project.
export function projectIndexForPrompt(): string {
  return PROJECTS.map((project) => `- ${project.slug}: ${project.name}`).join("\n");
}
