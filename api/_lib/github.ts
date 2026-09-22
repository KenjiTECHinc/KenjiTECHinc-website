// api/_lib/github.ts
//
// Thin wrapper around the GitHub REST API for repo stats: last push date,
// primary language, language breakdown, and top-level file structure.
//
// Caching note: Vercel serverless functions are stateless between cold
// starts, so this in-memory cache only helps on warm invocations (which is
// still useful — bursts of visitor questions in the same session will often
// hit a warm function). If you want caching that survives cold starts,
// swap CACHE for Vercel KV or Upstash Redis (both have free tiers) — the
// get/set calls below are the only thing you'd need to change.

const GITHUB_API = "https://api.github.com";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes — repo metadata doesn't change that often

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | undefined {
  const entry = CACHE.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    CACHE.delete(key);
    return undefined;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T): void {
  CACHE.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // A PAT (classic, "public_repo" scope is enough) raises your rate limit
  // from 60/hr (unauthenticated) to 5000/hr. Set GITHUB_TOKEN in Vercel env
  // vars. Not required for this to work, just recommended.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export interface RepoStats {
  repo: string;
  description: string | null;
  defaultBranch: string;
  primaryLanguage: string | null;
  languages: Record<string, number>; // bytes per language
  lastPushedAt: string;
  stars: number;
  topLevelFiles: string[];
  topLevelDirs: string[];
}

async function githubFetch(path: string): Promise<any> {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: githubHeaders() });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Repo not found: ${path}`);
    }
    if (res.status === 403 || res.status === 429) {
      throw new Error("GitHub API rate limit hit — try again shortly.");
    }
    throw new Error(`GitHub API error ${res.status} for ${path}`);
  }
  return res.json();
}

// repo: "owner/name"
export async function getRepoStats(repo: string): Promise<RepoStats> {
  const cacheKey = `repo-stats:${repo}`;
  const cached = getCached<RepoStats>(cacheKey);
  if (cached) return cached;

  const [repoData, languages, contents] = await Promise.all([
    githubFetch(`/repos/${repo}`),
    githubFetch(`/repos/${repo}/languages`),
    githubFetch(`/repos/${repo}/contents`),
  ]);

  const topLevelFiles = (contents as any[])
    .filter((entry) => entry.type === "file")
    .map((entry) => entry.name);
  const topLevelDirs = (contents as any[])
    .filter((entry) => entry.type === "dir")
    .map((entry) => entry.name);

  const stats: RepoStats = {
    repo,
    description: repoData.description,
    defaultBranch: repoData.default_branch,
    primaryLanguage: repoData.language,
    languages,
    lastPushedAt: repoData.pushed_at,
    stars: repoData.stargazers_count,
    topLevelFiles,
    topLevelDirs,
  };

  setCached(cacheKey, stats);
  return stats;
}