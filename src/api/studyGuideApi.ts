import axiosClient from '@/api/axiosClient'
import type {
  ApiResponse,
  QuizQuestionResponse,
  QuizRequest,
  QuizResponse,
  SummaryRequest,
  SummaryResponse,
} from '@/types/api'
import type { Question } from '@/types/quiz'
import type { StudyGuide } from '@/types/studyGuide'

type SummaryPart = Pick<StudyGuide, 'summary' | 'keyConcepts' | 'importantTerms'>

function toSummaryPart(response: SummaryResponse): SummaryPart {
  return {
    summary: [response.summary],
    keyConcepts: response.keyPoints,
    importantTerms: response.terms,
  }
}

function toQuestion(response: QuizQuestionResponse): Question {
  return {
    id: `q-${response.id}`,
    text: response.question,
    choices: response.choices.map((choice) => ({ id: choice.key.toLowerCase(), text: choice.text })),
    correctChoiceId: response.correctAnswer.toLowerCase(),
    explanation: response.explanation,
  }
}

export const studyGuideApi = {
  createSummary: async (notes: string): Promise<SummaryPart> => {
    const { data } = await axiosClient.post<ApiResponse<SummaryResponse>>('/summaries', {
      notes,
    } satisfies SummaryRequest)
    return toSummaryPart(data.data)
  },

  createQuiz: async (notes: string, questionCount: number): Promise<Question[]> => {
    const { data } = await axiosClient.post<ApiResponse<QuizResponse>>('/quizzes', {
      notes,
      questionCount,
    } satisfies QuizRequest)
    return data.data.questions.map(toQuestion)
  },
}
