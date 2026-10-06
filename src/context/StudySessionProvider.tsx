import { useCallback, useMemo, useReducer, useRef, type ReactNode } from 'react'
import {
  StudySessionContext,
  type StudySessionContextValue,
  type StudySessionState,
  type StudyView,
} from '@/context/studySessionContext'
import { toApiError } from '@/api/apiError'
import { generateQuestions, generateStudyGuide } from '@/services/studyGuideService'
import type { Question } from '@/types/quiz'
import type { StudyGuide } from '@/types/studyGuide'
import { saveSessionRecord } from '@/utils/sessionHistory'
import { shuffle } from '@/utils/shuffle'

type Action =
  | { type: 'setNotes'; notes: string }
  | { type: 'setView'; view: StudyView }
  | { type: 'generateStart' }
  | { type: 'generateProgress'; step: number }
  | { type: 'generateSuccess'; guide: StudyGuide; notes: string; quizError: string | null }
  | { type: 'generateError'; error: string }
  | { type: 'quizStart' }
  | { type: 'quizSuccess'; questions: Question[] }
  | { type: 'quizError'; error: string }
  | { type: 'beginQuiz'; questions: Question[] }
  | { type: 'selectChoice'; choiceId: string }
  | { type: 'submitAnswer' }
  | { type: 'nextQuestion' }
  | { type: 'reset' }

const initialState: StudySessionState = {
  notes: '',
  generatedNotes: null,
  view: 'notes',
  status: 'idle',
  loadingStep: 0,
  guide: null,
  error: null,
  quizStatus: 'idle',
  quizError: null,
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
    case 'setView':
      return { ...state, view: action.view }
    case 'generateStart':
      return {
        ...state,
        ...quizReset,
        status: 'loading',
        loadingStep: 0,
        guide: null,
        generatedNotes: null,
        error: null,
        quizStatus: 'loading',
        quizError: null,
      }
    case 'generateProgress':
      return { ...state, loadingStep: action.step }
    case 'generateSuccess':
      return {
        ...state,
        status: 'ready',
        view: 'summary',
        guide: action.guide,
        generatedNotes: action.notes,
        quizStatus: action.quizError ? 'error' : 'ready',
        quizError: action.quizError,
      }
    case 'generateError':
      return { ...state, status: 'error', view: 'notes', error: action.error, quizStatus: 'idle' }
    case 'quizStart':
      return { ...state, ...quizReset, quizStatus: 'loading', quizError: null }
    case 'quizSuccess':
      return state.guide
        ? { ...state, guide: { ...state.guide, questions: action.questions }, quizStatus: 'ready' }
        : state
    case 'quizError':
      return { ...state, quizStatus: 'error', quizError: action.error }
    case 'beginQuiz':
      return state.guide
        ? { ...state, ...quizReset, view: 'quiz', guide: { ...state.guide, questions: action.questions } }
        : state
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
    case 'reset':
      return initialState
  }
}

const STEP_BY_VIEW: Record<StudyView, number> = { notes: 1, summary: 3, quiz: 4 }

function getCurrentStep(state: StudySessionState) {
  return state.status === 'loading' ? 2 : STEP_BY_VIEW[state.view]
}

const shuffleChoices = (questions: Question[]) =>
  questions.map((question) => ({ ...question, choices: shuffle(question.choices) }))

export function StudySessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const requestId = useRef(0)

  const generate = useCallback(async () => {
    const id = ++requestId.current
    const notes = state.notes
    dispatch({ type: 'generateStart' })
    try {
      const { guide, quizError } = await generateStudyGuide(notes, (step) => {
        if (id === requestId.current) dispatch({ type: 'generateProgress', step })
      })
      if (id === requestId.current) dispatch({ type: 'generateSuccess', guide, notes, quizError })
    } catch (error) {
      if (id === requestId.current) {
        dispatch({ type: 'generateError', error: toApiError(error).message })
      }
    }
  }, [state.notes])

  const regenerateQuiz = useCallback(async () => {
    const id = requestId.current
    dispatch({ type: 'quizStart' })
    try {
      const questions = await generateQuestions(state.generatedNotes ?? state.notes)
      if (id === requestId.current) dispatch({ type: 'quizSuccess', questions })
    } catch (error) {
      if (id === requestId.current) dispatch({ type: 'quizError', error: toApiError(error).message })
    }
  }, [state.generatedNotes, state.notes])

  const startQuiz = useCallback(() => {
    const questions = state.guide?.questions ?? []
    if (questions.length > 0) {
      dispatch({ type: 'beginQuiz', questions: shuffleChoices(questions) })
      return
    }
    dispatch({ type: 'setView', view: 'quiz' })
    if (state.quizStatus !== 'loading') void regenerateQuiz()
  }, [state.guide, state.quizStatus, regenerateQuiz])

  const nextQuestion = useCallback(() => {
    const total = state.guide?.questions.length ?? 0
    if (state.currentQuestionIndex + 1 >= total) {
      saveSessionRecord({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        preview: (state.generatedNotes ?? state.notes).trim().slice(0, 120),
        score: state.answers.filter((a) => a.isCorrect).length,
        total,
      })
    }
    dispatch({ type: 'nextQuestion' })
  }, [state.guide, state.currentQuestionIndex, state.generatedNotes, state.notes, state.answers])

  const reset = useCallback(() => {
    requestId.current++
    dispatch({ type: 'reset' })
  }, [])

  const value = useMemo<StudySessionContextValue>(
    () => ({
      ...state,
      currentStep: getCurrentStep(state),
      isQuizInProgress:
        state.view === 'quiz' &&
        !state.isQuizFinished &&
        (state.answers.length > 0 || state.selectedChoiceId !== null),
      setNotes: (notes) => dispatch({ type: 'setNotes', notes }),
      generate,
      regenerateQuiz,
      goToNotes: () => dispatch({ type: 'setView', view: 'notes' }),
      goToSummary: () => dispatch({ type: 'setView', view: state.guide ? 'summary' : 'notes' }),
      startQuiz,
      retakeQuiz: startQuiz,
      selectChoice: (choiceId) => dispatch({ type: 'selectChoice', choiceId }),
      submitAnswer: () => dispatch({ type: 'submitAnswer' }),
      nextQuestion,
      reset,
    }),
    [state, generate, regenerateQuiz, startQuiz, nextQuestion, reset],
  )

  return <StudySessionContext.Provider value={value}>{children}</StudySessionContext.Provider>
}
