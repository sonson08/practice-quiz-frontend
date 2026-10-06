import { ArrowLeft, CircleAlert, LoaderCircle, RotateCcw } from 'lucide-react'
import Button from '@/components/common/Button'

interface QuizUnavailableProps {
  isLoading: boolean
  message: string | null
  onRetry: () => void
  onBack: () => void
}

function QuizUnavailable({ isLoading, message, onRetry, onBack }: QuizUnavailableProps) {
  if (isLoading) {
    return (
      <div className="quiz-empty" role="status">
        <LoaderCircle size={36} className="quiz-spinner" aria-hidden="true" />
        <p>Creating your quiz questions...</p>
      </div>
    )
  }

  return (
    <div className="quiz-empty" role="alert">
      <span className="quiz-empty-icon text-danger">
        <CircleAlert size={36} strokeWidth={1.75} />
      </span>
      <p>{message ?? 'No quiz questions could be created from these notes.'}</p>
      <p className="muted">Your summary is still available. You can try generating the quiz again.</p>
      <div className="quiz-unavailable-actions">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Summary
        </Button>
        <Button onClick={onRetry}>
          <RotateCcw size={16} /> Try Again
        </Button>
      </div>
    </div>
  )
}

export default QuizUnavailable
