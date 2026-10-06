export interface ApiResponse<T> {
  data: T
}

export interface ApiErrorBody {
  error: {
    code: string
    message: string
  }
}

export interface SummaryRequest {
  notes: string
}

export interface SummaryResponse {
  summary: string
  keyPoints: string[]
  terms: string[]
}

export type ChoiceKey = 'A' | 'B' | 'C' | 'D'

export interface QuizRequest {
  notes: string
  questionCount?: number
}

export interface QuizQuestionResponse {
  id: number
  question: string
  choices: { key: ChoiceKey; text: string }[]
  correctAnswer: ChoiceKey
  explanation: string
}

export interface QuizResponse {
  questions: QuizQuestionResponse[]
}
