import { FileQuestion } from 'lucide-react'
import { QUIZ_QUESTION_COUNT } from '@/constants/study'

function QuizEmpty() {
  return (
    <div className="quiz-empty">
      <span className="quiz-empty-icon">
        <FileQuestion size={40} strokeWidth={1.5} />
      </span>
      <p>Generate your study guide to see quiz questions here.</p>
      <p className="muted">The AI will create {QUIZ_QUESTION_COUNT} multiple-choice questions based on your notes.</p>
    </div>
  )
}

export default QuizEmpty
