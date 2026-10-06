import { isApiConfigured } from '@/api/axiosClient'
import { toApiError } from '@/api/apiError'
import { studyGuideApi } from '@/api/studyGuideApi'
import { LOADING_STEPS, QUIZ_QUESTION_COUNT } from '@/constants/study'
import { buildMockQuestions, buildMockStudyGuide } from '@/services/mockStudyGuide'
import type { Question } from '@/types/quiz'
import type { StudyGuide } from '@/types/studyGuide'
import { wait } from '@/utils/wait'

type ProgressHandler = (stepIndex: number) => void

export interface GenerateResult {
  guide: StudyGuide
  quizError: string | null
}

const MOCK_STEP_DELAY_MS = 700
const FIRST_STEP_DELAY_MS = 600

async function generateWithMock(notes: string, onProgress?: ProgressHandler): Promise<GenerateResult> {
  for (let step = 0; step < LOADING_STEPS.length; step++) {
    onProgress?.(step)
    await wait(MOCK_STEP_DELAY_MS)
  }
  return { guide: buildMockStudyGuide(notes), quizError: null }
}

async function generateWithApi(notes: string, onProgress?: ProgressHandler): Promise<GenerateResult> {
  onProgress?.(0)
  const firstStep = wait(FIRST_STEP_DELAY_MS).then(() => onProgress?.(1))

  const summaryRequest = studyGuideApi.createSummary(notes)
  const quizRequest = studyGuideApi.createQuiz(notes, QUIZ_QUESTION_COUNT).then(
    (questions) => ({ questions, quizError: null }),
    (error: unknown) => ({ questions: [] as Question[], quizError: toApiError(error).message }),
  )

  const summary = await summaryRequest
  await firstStep
  onProgress?.(2)

  const { questions, quizError } = await quizRequest
  onProgress?.(3)

  return { guide: { ...summary, questions }, quizError }
}

export function generateStudyGuide(notes: string, onProgress?: ProgressHandler): Promise<GenerateResult> {
  return isApiConfigured ? generateWithApi(notes, onProgress) : generateWithMock(notes, onProgress)
}

export async function generateQuestions(notes: string): Promise<Question[]> {
  if (!isApiConfigured) {
    await wait(MOCK_STEP_DELAY_MS)
    return buildMockQuestions(notes)
  }
  return studyGuideApi.createQuiz(notes, QUIZ_QUESTION_COUNT)
}
