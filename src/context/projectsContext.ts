// src/context/projectsContext.ts
import { createContext, useContext } from 'react';
import type { YearGroup } from '../types';

export interface ProjectsContextValue {
    projectsData: YearGroup[];
    isLoading: boolean;
}

export const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);

export function useProjects(): ProjectsContextValue {
    const context = useContext(ProjectsContext);

    if (!context) {
        throw new Error("useProjects must be used inside a ProjectsProvider layout wrapper.");
    }

    return context;
}
