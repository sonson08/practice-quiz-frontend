import { createContext } from 'react'
import type { QuizAnswer, StudyGuide } from '@/types/studyGuide'

export type SessionStatus = 'idle' | 'loading' | 'ready' | 'error'

export type QuizStatus = 'idle' | 'loading' | 'ready' | 'error'

export type StudyView = 'notes' | 'summary' | 'quiz'

export interface StudySessionState {
  notes: string
  generatedNotes: string | null
  view: StudyView
  status: SessionStatus
  loadingStep: number
  guide: StudyGuide | null
  error: string | null
  quizStatus: QuizStatus
  quizError: string | null
  currentQuestionIndex: number
  selectedChoiceId: string | null
  answers: QuizAnswer[]
  isQuizFinished: boolean
}

export interface StudySessionContextValue extends StudySessionState {
  currentStep: number
  isQuizInProgress: boolean
  setNotes: (notes: string) => void
  generate: () => Promise<void>
  regenerateQuiz: () => Promise<void>
  goToNotes: () => void
  goToSummary: () => void
  startQuiz: () => void
  retakeQuiz: () => void
  selectChoice: (choiceId: string) => void
  submitAnswer: () => void
  nextQuestion: () => void
  reset: () => void
}

export const StudySessionContext = createContext<StudySessionContextValue | null>(null)
