// src/components/molecules/ProjectCard.jsx
import { Badge } from '../atoms/Badge';
import { ExternalButton } from '../atoms/ExternalButton';
export function ProjectCard({ title, description, techStack, link }) {
    return (
        <div className="bg-surface px-6 py-4 rounded-2xl shadow-md border border-border-200 flex flex-col h-full min-h-64 hover:shadow-lg transition-shadow">
            {/* Title & Description */}
            <h6>{title}</h6>
            <p className="mb-4 grow line-clamp-3">{description}</p>

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {techStack.sort().map((tech, index) => (
                    <Badge key={index} text={tech} />
                ))}
            </div>

            {/* Action */}
            <div className="mt-auto">
                <ExternalButton href={link}>
                    Go to Project
                </ExternalButton>
            </div>
        </div>
    );
}