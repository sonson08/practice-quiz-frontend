import { isApiConfigured } from '@/api/axiosClient'
import { ApiError } from '@/api/apiError'
import { studyGuideApi } from '@/api/studyGuideApi'
import { LOADING_STEPS, QUIZ_QUESTION_COUNT } from '@/constants/study'
import { buildMockQuestions, buildMockStudyGuide } from '@/services/mockStudyGuide'
import type { Question } from '@/types/quiz'
import type { StudyGuide } from '@/types/studyGuide'
import { wait } from '@/utils/wait'

type ProgressHandler = (stepIndex: number) => void

const MOCK_STEP_DELAY_MS = 700
const FIRST_STEP_DELAY_MS = 600

async function generateWithMock(notes: string, onProgress?: ProgressHandler) {
  for (let step = 0; step < LOADING_STEPS.length; step++) {
    onProgress?.(step)
    await wait(MOCK_STEP_DELAY_MS)
  }
  return buildMockStudyGuide(notes)
}

async function fetchQuestions(notes: string): Promise<Question[]> {
  try {
    return await studyGuideApi.createQuiz(notes, QUIZ_QUESTION_COUNT)
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') return buildMockQuestions(notes)
    throw error
  }
}

async function generateWithApi(notes: string, onProgress?: ProgressHandler): Promise<StudyGuide> {
  onProgress?.(0)
  const firstStep = wait(FIRST_STEP_DELAY_MS).then(() => onProgress?.(1))

  const summaryRequest = studyGuideApi.createSummary(notes)
  const quizRequest = fetchQuestions(notes)
  quizRequest.catch(() => {})

  const summary = await summaryRequest
  await firstStep
  onProgress?.(2)

  const questions = await quizRequest
  onProgress?.(3)

  return { ...summary, questions }
}

export function generateStudyGuide(notes: string, onProgress?: ProgressHandler): Promise<StudyGuide> {
  return isApiConfigured ? generateWithApi(notes, onProgress) : generateWithMock(notes, onProgress)
}
