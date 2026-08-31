// src/context/ProjectsProvider.tsx
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ProjectsContext } from './projectsContext';
import type { Project, ProjectRow, YearGroup } from '../types';

interface ProjectsProviderProps {
    children: ReactNode;
}

export function ProjectsProvider({ children }: ProjectsProviderProps) {
    const [projectsData, setProjectsData] = useState<YearGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        // If we already fetched data once during this session, stop here.
        if (hasFetched) return;

        async function fetchProjects() {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching projects:", error);
                setIsLoading(false);
                return;
            }

            const rows = (data ?? []) as ProjectRow[];

            const groupedObj = rows.reduce<Record<string, Project[]>>((acc, project) => {
                const year = project.year.toString();
                if (!acc[year]) acc[year] = [];
                acc[year].push(project);
                return acc;
            }, {});

            const formattedArray: YearGroup[] = Object.entries(groupedObj)
                .map(([year, projectsArray]) => ({
                    year: year,
                    projects: projectsArray
                }))
                .sort((a, b) => Number(b.year) - Number(a.year));

            setProjectsData(formattedArray);
            setHasFetched(true);
            setIsLoading(false);
        }

        fetchProjects();
    }, [hasFetched]);

    return (
        <ProjectsContext.Provider value={{ projectsData, isLoading }}>
            {children}
        </ProjectsContext.Provider>
    );
}
