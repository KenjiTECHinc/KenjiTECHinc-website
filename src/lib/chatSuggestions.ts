export interface ChatSuggestion {
    label: string;
    prompt: string;
}

export const STARTER_SUGGESTIONS: ChatSuggestion[] = [
    {
        label: 'Ask about a project origin story.',
        prompt: 'What is Minesweep Plus, and why did you build it?',
    },
    {
        label: `What's the latest update?`,
        prompt: 'When was the KenjiTECHinc website repository last updated on GitHub?',
    },
    {
        label: 'Deep dive into a project.',
        prompt: 'What is the MICCAI 2025 SurgVU project, and what does it do?',
    },
    {
        label: 'GitHub followings.',
        prompt: 'How many followers does the KenjiTECHinc GitHub have?',
    }
];
