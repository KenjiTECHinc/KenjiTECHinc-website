// api/_lib/github.ts
//
// Thin wrapper around the GitHub REST API for repo stats: last push date,
// primary language, language breakdown, and top-level file structure.
//
// Successful responses are stored in Vercel Runtime Cache for 15 minutes so
// they survive cold starts. Keys are prefixed because Hobby shares one cache
// across every project on the team. Chat turns and rate limits are not stored
// here. If Runtime Cache is unavailable (local `vercel dev`), the in-memory
// map below is the fallback for the current process.

import { getCache } from "@vercel/functions";

const GITHUB_API = "https://api.github.com";
const CACHE_TTL_SECONDS = 15 * 60; // repo metadata doesn't change that often
const CACHE_TTL_MS = CACHE_TTL_SECONDS * 1000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const MEMORY_CACHE = new Map<string, CacheEntry<unknown>>();

function memoryGet<T>(key: string): T | undefined {
  const entry = MEMORY_CACHE.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    MEMORY_CACHE.delete(key);
    return undefined;
  }
  return entry.data as T;
}

function memorySet<T>(key: string, data: T): void {
  MEMORY_CACHE.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

function isRepoStats(value: unknown): value is RepoStats {
  if (!value || typeof value !== "object") return false;
  const stats = value as Record<string, unknown>;
  return (
    typeof stats.repo === "string" &&
    typeof stats.defaultBranch === "string" &&
    typeof stats.lastPushedAt === "string" &&
    typeof stats.stars === "number" &&
    Array.isArray(stats.topLevelFiles) &&
    Array.isArray(stats.topLevelDirs)
  );
}

async function readCache<T>(key: string, isValue: (value: unknown) => value is T): Promise<T | undefined> {
  try {
    const cached = await getCache().get(key);
    if (isValue(cached)) return cached;
  } catch {
    return memoryGet<T>(key);
  }
  return memoryGet<T>(key);
}

async function writeCache(key: string, value: unknown, name: string): Promise<void> {
  memorySet(key, value);
  try {
    await getCache().set(key, value, {
      ttl: CACHE_TTL_SECONDS,
      name,
    });
  } catch {
    // Runtime Cache is unavailable outside Vercel. The memory entry is enough.
  }
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
  const cacheKey = `kenjitechinc:repo-stats:${repo}`;
  const cached = await readCache(cacheKey, isRepoStats);
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

  await writeCache(cacheKey, stats, "github-repo-stats");
  return stats;
}

export interface GitHubFollower {
  login: string;
  profileUrl: string;
}

export interface GitHubFollowers {
  login: string;
  followerCount: number;
  followers: GitHubFollower[];
}

function isGitHubFollowers(value: unknown): value is GitHubFollowers {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.login === "string" &&
    typeof data.followerCount === "number" &&
    Array.isArray(data.followers)
  );
}

export async function getGitHubFollowers(): Promise<GitHubFollowers> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GitHub token is not configured.");
  }

  const cacheKey = "kenjitechinc:github-followers";
  const cached = await readCache(cacheKey, isGitHubFollowers);
  if (cached) return cached;

  const [user, followerList] = await Promise.all([
    githubFetch("/user"),
    githubFetch("/user/followers?per_page=30"),
  ]);

  const followers = (Array.isArray(followerList) ? followerList : []).map((follower) => ({
    login: String(follower?.login ?? ""),
    profileUrl: String(follower?.html_url ?? ""),
  }));

  const payload: GitHubFollowers = {
    login: String(user.login ?? ""),
    followerCount: Number(user.followers ?? followers.length),
    followers,
  };

  await writeCache(cacheKey, payload, "github-followers");
  return payload;
}