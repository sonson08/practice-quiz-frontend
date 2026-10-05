import type { Question } from '@/types/quiz'

export type SummaryLength = 'short' | 'detailed'

export interface StudyGuide {
  summary: string[]
  keyConcepts: string[]
  importantTerms: string[]
  questions: Question[]
}

export interface QuizAnswer {
  questionId: string
  choiceId: string
  isCorrect: boolean
}

export interface SessionRecord {
  id: string
  createdAt: string
  preview: string
  score: number
  total: number
}
