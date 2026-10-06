import { BookText, CircleCheck, CircleX, FilePlus2, RotateCcw, Trophy } from 'lucide-react'
import Button from '@/components/common/Button'
import ProgressBar from '@/components/common/ProgressBar'

interface QuizResultProps {
  score: number
  total: number
  onRetake: () => void
  onReviewSummary: () => void
  onNewNotes: () => void
}

function getMessage(percent: number) {
  if (percent === 100) return 'Perfect score! Outstanding work.'
  if (percent >= 80) return 'Great job! Keep studying.'
  if (percent >= 50) return 'Good effort! Review the summary and try again.'
  return 'Keep going! Review the summary and give it another shot.'
}

function QuizResult({ score, total, onRetake, onReviewSummary, onNewNotes }: QuizResultProps) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className="quiz-result">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <Trophy className="trophy" size={56} strokeWidth={1.5} aria-hidden="true" />
      <h3>Quiz Complete!</h3>

      <div className="score-box">
        <p className="score-value">
          {score} / {total}
        </p>
        <div className="score-bar">
          <ProgressBar value={percent} tone="green" label="Score" />
          <span>{percent}%</span>
        </div>
        <p className="muted">{getMessage(percent)}</p>
      </div>

      <ul className="score-breakdown">
        <li>
          <CircleCheck size={18} className="text-success" /> Correct Answers <strong>{score}</strong>
        </li>
        <li>
          <CircleX size={18} className="text-danger" /> Incorrect Answers{' '}
          <strong className="text-danger">{total - score}</strong>
        </li>
      </ul>

      <div className="result-actions">
        <Button variant="outline" onClick={onRetake}>
          <RotateCcw size={16} /> Retake Quiz
        </Button>
        <Button onClick={onReviewSummary}>
          <BookText size={16} /> Review Summary
        </Button>
      </div>
      <Button variant="ghost" onClick={onNewNotes} className="result-new-notes">
        <FilePlus2 size={16} /> Start with New Notes
      </Button>
    </div>
  )
}

export default QuizResult
