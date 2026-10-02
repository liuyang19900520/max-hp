/**
 * Portfolio data source.
 *
 * To add a project, append an entry to the array below — the UI renders it
 * automatically and no component changes are needed. Put architecture
 * diagrams in public/ and set architectureImage to a path starting with "/".
 */

export interface Project {
  /** Unique identifier, used as the React key */
  id: string;
  /** Project name */
  title: string;
  /** One-line tagline */
  subtitle: string;
  /** Card blurb (clamped to two lines) */
  description: string;
  /** Full description shown in the detail modal */
  detailDescription: string;
  /** Tech stack; the card shows only the first three */
  techStack: string[];
  /** Key feature list */
  features: string[];
  /** Architecture diagram path, relative to public/; the section is hidden when omitted */
  architectureImage?: string;
  /** Live project URL */
  externalUrl: string;
  /** Label of the modal's link button, defaults to "Visit Project" */
  ctaLabel?: string;
  /** Card icon */
  emoji: string;
  /** App icon path relative to public/; replaces the emoji when set */
  iconImage?: string;
  /** Notable design decisions, optional */
  designDecisions?: string[];
}

export const projects: Project[] = [
  {
    id: 'nba-ai-agent',
    title: 'NBA AI Agent',
    subtitle: 'AI-Powered Basketball Analytics',
    description:
      'An intelligent NBA analysis agent built with LangChain, capable of game predictions, lineup optimization, and real-time stats analysis.',
    detailDescription:
      'This NBA AI Agent leverages Large Language Models and the LangChain framework to provide intelligent basketball analytics. The agent can predict game outcomes, optimize team lineups using AI-driven analysis, and provide real-time leaderboard tracking. It integrates with NBA statistics APIs and uses LangSmith for monitoring and debugging agent performance.',
    techStack: ['Next.js', 'LangChain', 'LangSmith', 'Python', 'FastAPI', 'AWS'],
    features: [
      '🏀 AI Game Prediction - Predict NBA game results using multi-factor analysis',
      '📊 1-Click Lineup Optimizer - AI-powered optimal lineup suggestions',
      '🏆 Real-time Leaderboard - Player and team performance tracking',
      '🤖 Agent Monitoring - LangSmith integration for performance debugging',
    ],
    architectureImage: '/nba-agent-architecture.png',
    externalUrl: 'https://nba-game.liuyang19900520.com/',
    emoji: '🏀',
    designDecisions: [
      'LangChain Agent framework for flexible tool orchestration',
      'LangSmith integration for production monitoring & debugging',
      'FastAPI backend with async endpoints for AI inference',
    ],
  },
  {
    id: 'words-maker',
    title: 'WordsMaker',
    subtitle: 'Automated Vocabulary Extraction Tool',
    description:
      'An automated English vocabulary extraction tool for learners who read academic papers or textbooks. Upload a PDF, specify a page range, and get new words imported to your study list.',
    detailDescription:
      'WordsMaker is designed for English learners who regularly read academic papers or textbooks. Upload a PDF, specify a page range, and the system automatically: OCRs each page using Google Vision API, processes the extracted text with NLP (spaCy for named-entity recognition, NLTK for POS-tagging and lemmatization) to extract meaningful vocabulary — filtering stopwords, punctuation, and proper nouns, stores word frequencies in DynamoDB building a personal frequency corpus over time, and deduplicates against your existing Eudic study list importing only new words — so you never add duplicates.',
    techStack: [
      'Next.js',
      'Python',
      'AWS Lambda',
      'DynamoDB',
      'Google Vision API',
      'Terraform',
      'GitHub Actions',
    ],
    features: [
      '📄 PDF OCR Processing - Upload PDFs and OCR each page via Google Vision API',
      '🧠 NLP Vocabulary Extraction - spaCy NER + NLTK POS-tagging & lemmatization for meaningful words',
      '📊 Personal Frequency Corpus - DynamoDB-backed word frequency tracking over time',
      '🔄 Eudic Deduplication - Auto-dedup against your study list, import only new words',
      '☁️ Serverless Architecture - Lambda + Function URL keeps costs near zero',
      '🏗️ Infrastructure as Code - Terraform with S3 state, fully automated CI/CD',
    ],
    architectureImage: '/words-marker-architecture.png',
    externalUrl: 'https://master.do1usm8cu9yli.amplifyapp.com/',
    emoji: '📚',
    designDecisions: [
      'Serverless-first: Lambda + Function URL keeps costs near zero at low usage',
      'Monorepo with separate frontend/backend/infra concerns',
      'Infrastructure-as-Code via Terraform with state in S3',
      'Secrets managed in AWS Secrets Manager, never in source code',
      'CI/CD fully automated: GitHub Actions for backend (Docker → ECR → Lambda), Amplify for frontend',
    ],
  },
  {
    id: 'kage-loop',
    title: 'Kage Loop',
    subtitle: 'A-B Repeat Video Player for iOS',
    description:
      'A minimalist iOS video player built for one thing: repeating a section of a video until you have got it. Ideal for shadowing, language learning and music transcription.',
    detailDescription:
      'Kage Loop is a minimalist video player built for one thing: repeating a section of a video until you have got it. It is perfect for shadowing practice, language learning, music transcription, or drilling any passage that needs repetition. Videos play straight from your photo library and are never copied or uploaded.',
    techStack: ['iOS', 'Swift', 'SwiftUI', 'AVFoundation'],
    features: [
      '🔁 A-B Repeat - Mark a start and an end point and playback loops between them until you cancel; both points show on the scrubber',
      '📝 Word Lists - Jot down words as you practice, one list per video, with on-device translations; your notes outlive your videos',
      '📂 Playlists - Group related videos and name them; episodes sort the way you read them (02 before 10)',
      '⏩ Playback Built for Practice - Speed 0.8x to 1.2x with natural pitch, tap to jump 3s, resume where you left off, audio on a locked screen',
      '🔒 Completely Private - No account, no network requests, no analytics, no ads',
    ],
    externalUrl: 'https://apps.apple.com/jp/app/kage-loop/id6806611473',
    ctaLabel: 'Download on the App Store',
    emoji: '🔁',
    iconImage: '/kage-loop-icon.png',
  },
];
