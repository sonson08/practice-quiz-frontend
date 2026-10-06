import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, PencilLine } from 'lucide-react'
import Button from '@/components/common/Button'
import LoadingPanel from '@/components/study/LoadingPanel'
import NotesCard from '@/components/study/NotesCard'
import QuizCard from '@/components/study/QuizCard'
import StepActions from '@/components/study/StepActions'
import Stepper from '@/components/study/Stepper'
import SummaryCard from '@/components/study/SummaryCard'
import { useStudySession } from '@/hooks/useStudySession'

const LEAVE_QUIZ_MESSAGE = 'Leave the quiz? Your progress on this attempt will be lost.'

function HomePage() {
  const {
    view,
    status,
    loadingStep,
    guide,
    notes,
    generatedNotes,
    quizStatus,
    currentStep,
    isQuizInProgress,
    goToNotes,
    goToSummary,
    startQuiz,
  } = useStudySession()

  const isLoading = status === 'loading'
  const hasGuide = guide !== null && !isLoading
  const isGuideCurrent = hasGuide && generatedNotes === notes

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view, isLoading])

  const confirmLeaveQuiz = () => !isQuizInProgress || window.confirm(LEAVE_QUIZ_MESSAGE)

  const isStepEnabled = (step: number) => {
    if (isLoading) return false
    if (step === 1) return true
    if (step === 3 || step === 4) return hasGuide
    return false
  }

  const handleStepClick = (step: number) => {
    if (!confirmLeaveQuiz()) return
    if (step === 1) goToNotes()
    if (step === 3) goToSummary()
    if (step === 4) startQuiz()
  }

  const renderStep = () => {
    if (isLoading) return <LoadingPanel currentStep={loadingStep} />

    if (view === 'summary' && guide) {
      return (
        <>
          <SummaryCard guide={guide} />
          {quizStatus === 'error' && (
            <p className="step-note" role="status">
              The quiz couldn't be created yet. Click Start Quiz to try again.
            </p>
          )}
          <StepActions>
            <Button variant="outline" onClick={goToNotes}>
              <ArrowLeft size={16} /> Edit Notes
            </Button>
            <Button onClick={startQuiz}>
              Start Quiz <ArrowRight size={16} />
            </Button>
          </StepActions>
        </>
      )
    }

    if (view === 'quiz' && guide) return <QuizCard />

    return (
      <>
        <NotesCard />
        {isGuideCurrent && (
          <StepActions>
            <span className="step-actions-hint">
              <PencilLine size={16} /> Edit your notes and generate again, or continue with your current guide.
            </span>
            <Button variant="outline" onClick={goToSummary}>
              Continue to Summary <ArrowRight size={16} />
            </Button>
          </StepActions>
        )}
      </>
    )
  }

  return (
    <div className="study-page">
      <header className="page-header">
        <div>
          <h1>AI Study Buddy</h1>
          <p className="page-subtitle">Paste your notes, and let AI create a summary and quiz for you.</p>
        </div>
      </header>

      <Stepper currentStep={currentStep} isStepEnabled={isStepEnabled} onStepClick={handleStepClick} />

      <div className="study-step">{renderStep()}</div>
    </div>
  )
}

export default HomePage
