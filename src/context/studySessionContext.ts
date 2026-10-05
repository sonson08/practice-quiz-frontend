import { createContext } from 'react'
import type { QuizAnswer, StudyGuide, SummaryLength } from '@/types/studyGuide'

export type SessionStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface StudySessionState {
  notes: string
  summaryLength: SummaryLength
  status: SessionStatus
  loadingStep: number
  guide: StudyGuide | null
  error: string | null
  currentQuestionIndex: number
  selectedChoiceId: string | null
  answers: QuizAnswer[]
  isQuizFinished: boolean
}

export interface StudySessionContextValue extends StudySessionState {
  currentStep: number
  setNotes: (notes: string) => void
  setSummaryLength: (length: SummaryLength) => void
  generate: () => Promise<void>
  selectChoice: (choiceId: string) => void
  submitAnswer: () => void
  nextQuestion: () => void
  retryQuiz: () => void
  reset: () => void
}

export const StudySessionContext = createContext<StudySessionContextValue | null>(null)
