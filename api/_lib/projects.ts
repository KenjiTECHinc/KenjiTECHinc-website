// api/_lib/projects.ts
//
// Static "blog/writeup" knowledge for your chatbot. This is the content the
// router falls back to for "why did you build X" / "what is X about" style
// questions, as opposed to "when was X last updated" which goes to the
// GitHub API tool instead.
//
// Keep this hand-written and short per project — a paragraph or two. Do NOT
// dump your whole README in here; that bloats every request's token cost.
// If you later have many projects, consider moving this to a CMS or a
// separate JSON file fetched at build time instead of hardcoding it.

export interface ProjectInfo {
    slug: string; // short id you and the model will refer to it by
    name: string; // display name
    githubRepo?: string; // "owner/repo", used to link this project to the GitHub tool
    summary: string; // 1-3 sentences: what it is, why you built it, what's interesting about it
    tags?: string[];
  }
  
  export const PROJECTS: ProjectInfo[] = [
  {
    slug: "qr-code-phishing-detection",
    name: "QR Code Phishing Detection",
    githubRepo: "Kyou140/QR-Code-Phishing",
    summary:
      "A Python and LLM project that analyzes suspicious emails and fake URLs to help defend against QR-code phishing.",
    tags: ["python", "llm", "security"],
  },
  {
    slug: "job-scraping-thai",
    name: "Job Scraping [Thai]",
    githubRepo: "Nattapat140/job-scraping",
    summary:
      "A Python web-scraping project for collecting and monitoring Thailand's technology job market data.",
    tags: ["python", "web-scraping"],
  },
  {
    slug: "personal-website",
    name: "KenjiTECHinc Website",
    githubRepo: "KenjiTECHinc/KenjiTECHinc-website",
    summary:
      "My personal portfolio and playground, built with React, Vite, and TypeScript. It showcases projects, blog posts, and a chatbot for answering questions about my work.",
    tags: ["react", "typescript", "vite", "web"],
  },
  {
    slug: "surgvu",
    name: "MICCAI 2025 - SurgVU",
    summary:
      "A computer-vision project for classifying surgical tools in videos, built for the MICCAI 2025 competition and conference.",
    tags: ["python", "yolo", "cnn", "ai", "computer-vision"],
  },
  {
    slug: "icaif-finance-rag",
    name: "ACM ICAIF'24 Finance RAG",
    githubRepo: "KenjiTECHinc/ICAIF-FinanceRAG",
    summary:
      "A retrieval-augmented generation system for searching and answering questions about financial documents for the ACM ICAIF'24 competition.",
    tags: ["python", "rag", "llm", "ai"],
  },
  {
    slug: "minesweep-plus",
    name: "Minesweep Plus",
    githubRepo: "KenjiTECHinc/minesweep-plus",
    summary:
      "A classic Minesweeper game built as an early React project, with a little extra personality in the name.",
    tags: ["react", "game"],
  },
  {
    slug: "website-adblocker",
    name: "Website AdBlocker",
    githubRepo: "KenjiTECHinc/web-adblocker",
    summary:
      "A JavaScript browser extension that blocks sponsored posts on LinkedIn.",
    tags: ["javascript", "browser-extension"],
  },
  {
    slug: "english-braille-translator",
    name: "English-Braille Text OCR and Translation",
    githubRepo: "KenjiTECHinc/English-Braille-translator",
    summary:
      "A machine-learning project that uses OCR to translate English book text into Braille.",
    tags: ["python", "tensorflow", "opencv", "cnn", "ai"],
  },
  {
    slug: "patent-portfolio-dashboard",
    name: "Patent Portfolio Dashboard",
    githubRepo: "KenjiTECHinc/PatentPortfolio-Dashboard",
    summary:
      "A dashboard for comparing System-on-Chip patent portfolios across three major competitors.",
    tags: ["python", "sqlite", "data-visualization"],
  },
  {
    slug: "bfriends-app",
    name: "BFriends App",
    githubRepo: "BFriends-inc/BFriends-app",
    summary:
      "A Flutter and Google Cloud app for helping people find friends with shared interests.",
    tags: ["flutter", "google-cloud", "mobile"],
  },
  {
    slug: "reflex-trainer",
    name: "Reflex Trainer",
    githubRepo: "KenjiTECHinc/Reflex-Trainer",
    summary:
      "An Aimlabs-inspired reflex game designed in Verilog for play on an FPGA.",
    tags: ["verilog", "fpga", "game"],
  },
  {
    slug: "minitchess-bot",
    name: "MinitChess Bot",
    githubRepo: "KenjiTECHinc/MinitChess-Bot",
    summary:
      "A simple C++ chess bot that introduced me to practical AI algorithms.",
    tags: ["c-plus-plus", "ai", "game"],
  },
  {
    slug: "tower-defense-game",
    name: "Tower Defense Game",
    githubRepo: "KenjiTECHinc/TowerDefense-Game",
    summary:
      "A C++ tower-defense game and one of my earliest programming projects.",
    tags: ["c-plus-plus", "game"],
  },
];
  
  export function findProject(slug: string): ProjectInfo | undefined {
    return PROJECTS.find((p) => p.slug === slug);
  }
  
  export function listProjectSlugs(): string[] {
    return PROJECTS.map((p) => p.slug);
  }
  
  // Gives the model a lightweight index of what projects exist, so it can pick
  // a slug for the get_project_info tool without you hardcoding the mapping
  // into the system prompt every time you add a project.
  export function projectIndexForPrompt(): string {
    return PROJECTS.map((p) => `- ${p.slug}: ${p.name}`).join("\n");
  }