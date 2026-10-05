import { useCallback, useMemo, useReducer, useRef, type ReactNode } from 'react'
import {
  StudySessionContext,
  type StudySessionContextValue,
  type StudySessionState,
} from '@/context/studySessionContext'
import { generateStudyGuide } from '@/services/studyGuideService'
import type { StudyGuide, SummaryLength } from '@/types/studyGuide'
import { saveSessionRecord } from '@/utils/sessionHistory'

type Action =
  | { type: 'setNotes'; notes: string }
  | { type: 'setSummaryLength'; length: SummaryLength }
  | { type: 'generateStart' }
  | { type: 'generateProgress'; step: number }
  | { type: 'generateSuccess'; guide: StudyGuide }
  | { type: 'generateError'; error: string }
  | { type: 'selectChoice'; choiceId: string }
  | { type: 'submitAnswer' }
  | { type: 'nextQuestion' }
  | { type: 'retryQuiz' }
  | { type: 'reset' }

const initialState: StudySessionState = {
  notes: '',
  summaryLength: 'detailed',
  status: 'idle',
  loadingStep: 0,
  guide: null,
  error: null,
  currentQuestionIndex: 0,
  selectedChoiceId: null,
  answers: [],
  isQuizFinished: false,
}

const quizReset = {
  currentQuestionIndex: 0,
  selectedChoiceId: null,
  answers: [],
  isQuizFinished: false,
} satisfies Partial<StudySessionState>

function reducer(state: StudySessionState, action: Action): StudySessionState {
  switch (action.type) {
    case 'setNotes':
      return { ...state, notes: action.notes }
    case 'setSummaryLength':
      return { ...state, summaryLength: action.length }
    case 'generateStart':
      return { ...state, ...quizReset, status: 'loading', loadingStep: 0, guide: null, error: null }
    case 'generateProgress':
      return { ...state, loadingStep: action.step }
    case 'generateSuccess':
      return { ...state, status: 'ready', guide: action.guide }
    case 'generateError':
      return { ...state, status: 'error', error: action.error }
    case 'selectChoice': {
      const question = state.guide?.questions[state.currentQuestionIndex]
      const isAnswered = state.answers.some((a) => a.questionId === question?.id)
      return isAnswered ? state : { ...state, selectedChoiceId: action.choiceId }
    }
    case 'submitAnswer': {
      const question = state.guide?.questions[state.currentQuestionIndex]
      if (!question || !state.selectedChoiceId) return state
      return {
        ...state,
        answers: [
          ...state.answers,
          {
            questionId: question.id,
            choiceId: state.selectedChoiceId,
            isCorrect: state.selectedChoiceId === question.correctChoiceId,
          },
        ],
      }
    }
    case 'nextQuestion': {
      const total = state.guide?.questions.length ?? 0
      if (state.currentQuestionIndex + 1 >= total) return { ...state, isQuizFinished: true }
      return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1, selectedChoiceId: null }
    }
    case 'retryQuiz':
      return { ...state, ...quizReset }
    case 'reset':
      return initialState
  }
}

function getCurrentStep(state: StudySessionState) {
  if (state.status === 'loading') return 2
  if (state.status !== 'ready') return 1
  if (state.answers.length > 0 || state.selectedChoiceId) return 4
  return 3
}

export function StudySessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const requestId = useRef(0)

  const generate = useCallback(async () => {
    const id = ++requestId.current
    dispatch({ type: 'generateStart' })
    try {
      const guide = await generateStudyGuide(state.notes, state.summaryLength, (step) => {
        if (id === requestId.current) dispatch({ type: 'generateProgress', step })
      })
      if (id === requestId.current) dispatch({ type: 'generateSuccess', guide })
    } catch {
      if (id === requestId.current) {
        dispatch({ type: 'generateError', error: 'Something went wrong while generating. Please try again.' })
      }
    }
  }, [state.notes, state.summaryLength])

  const nextQuestion = useCallback(() => {
    const total = state.guide?.questions.length ?? 0
    if (state.currentQuestionIndex + 1 >= total) {
      saveSessionRecord({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        preview: state.notes.trim().slice(0, 120),
        score: state.answers.filter((a) => a.isCorrect).length,
        total,
      })
    }
    dispatch({ type: 'nextQuestion' })
  }, [state.guide, state.currentQuestionIndex, state.notes, state.answers])

  const reset = useCallback(() => {
    requestId.current++
    dispatch({ type: 'reset' })
  }, [])

  const value = useMemo<StudySessionContextValue>(
    () => ({
      ...state,
      currentStep: getCurrentStep(state),
      setNotes: (notes) => dispatch({ type: 'setNotes', notes }),
      setSummaryLength: (length) => dispatch({ type: 'setSummaryLength', length }),
      generate,
      selectChoice: (choiceId) => dispatch({ type: 'selectChoice', choiceId }),
      submitAnswer: () => dispatch({ type: 'submitAnswer' }),
      nextQuestion,
      retryQuiz: () => dispatch({ type: 'retryQuiz' }),
      reset,
    }),
    [state, generate, nextQuestion, reset],
  )

  return <StudySessionContext.Provider value={value}>{children}</StudySessionContext.Provider>
}
