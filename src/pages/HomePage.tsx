import { RotateCcw } from 'lucide-react'
import Button from '@/components/common/Button'
import LoadingPanel from '@/components/study/LoadingPanel'
import NotesCard from '@/components/study/NotesCard'
import QuizCard from '@/components/study/QuizCard'
import Stepper from '@/components/study/Stepper'
import SummaryCard from '@/components/study/SummaryCard'
import { useStudySession } from '@/hooks/useStudySession'

function HomePage() {
  const { status, loadingStep, guide, currentStep, reset } = useStudySession()

  return (
    <div className="study-page">
      <header className="page-header">
        <div>
          <h1>AI Study Buddy</h1>
          <p className="page-subtitle">Paste your notes, and let AI create a summary and quiz for you.</p>
        </div>
        <Button variant="outline" className="reset-button" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </Button>
      </header>

      <Stepper currentStep={currentStep} />

      {status === 'loading' ? (
        <LoadingPanel currentStep={loadingStep} />
      ) : (
        <div className="study-grid">
          <NotesCard />
          <SummaryCard guide={guide} />
          <QuizCard />
        </div>
      )}
    </div>
  )
}

export default HomePage
