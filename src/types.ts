// src/types.ts

/** App-facing project shape, matching src/data/projects.json. */
export interface Project {
    id: number;
    title: string;
    description: string;
    techStack: string[];
    repoUrl: string;
}

export interface YearGroup {
    year: string;
    projects: Project[];
}

/** Social link shape, matching src/data/connect.json. */
export interface ConnectButton {
    name: string;
    url: string;
    message: string;
}

/**
 * Row shape returned by `select('*')` on the Supabase `projects` table.
 * The table is assumed to store the camelCase fields above; regenerate this
 * from the live schema (`supabase gen types`) before relying on it.
 */
export interface ProjectRow extends Project {
    year: number | string;
    created_at: string;
}
