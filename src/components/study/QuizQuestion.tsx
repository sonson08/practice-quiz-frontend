import { ArrowRight, CircleCheck, CircleX } from 'lucide-react'
import Button from '@/components/common/Button'
import ProgressBar from '@/components/common/ProgressBar'
import type { Question } from '@/types/quiz'
import type { QuizAnswer } from '@/types/studyGuide'

interface QuizQuestionProps {
  question: Question
  index: number
  total: number
  selectedChoiceId: string | null
  answer: QuizAnswer | undefined
  onSelect: (choiceId: string) => void
  onSubmit: () => void
  onNext: () => void
}

function getChoiceState(choiceId: string, question: Question, selectedChoiceId: string | null, answer?: QuizAnswer) {
  if (!answer) return choiceId === selectedChoiceId ? 'selected' : ''
  if (choiceId === question.correctChoiceId) return 'correct'
  if (choiceId === answer.choiceId) return 'incorrect'
  return 'dimmed'
}

function QuizQuestion({
  question,
  index,
  total,
  selectedChoiceId,
  answer,
  onSelect,
  onSubmit,
  onNext,
}: QuizQuestionProps) {
  const isLast = index + 1 === total
  const correctChoice = question.choices.find((c) => c.id === question.correctChoiceId)

  return (
    <div className="quiz-question">
      <p className="quiz-progress-label">
        Question {index + 1} of {total}
      </p>
      <ProgressBar value={((index + (answer ? 1 : 0)) / total) * 100} label="Quiz progress" />

      {answer && (
        <div className={`feedback ${answer.isCorrect ? 'correct' : 'incorrect'}`} role="status">
          {answer.isCorrect ? <CircleCheck size={22} /> : <CircleX size={22} />}
          <div>
            <p className="feedback-title">{answer.isCorrect ? 'Correct!' : 'Not quite.'}</p>
            <p>
              {!answer.isCorrect && correctChoice && (
                <>
                  The answer is <strong>{correctChoice.text}</strong>.{' '}
                </>
              )}
              {question.explanation}
            </p>
          </div>
        </div>
      )}

      <h3 className="quiz-question-text">{question.text}</h3>

      <div className="choices" role="radiogroup" aria-label="Answer choices">
        {question.choices.map((choice, choiceIndex) => {
          const state = getChoiceState(choice.id, question, selectedChoiceId, answer)
          return (
            <button
              key={choice.id}
              type="button"
              role="radio"
              aria-checked={choice.id === (answer?.choiceId ?? selectedChoiceId)}
              className={`choice ${state}`.trim()}
              onClick={() => onSelect(choice.id)}
              disabled={Boolean(answer)}
            >
              <span className="choice-mark" aria-hidden="true" />
              <span className="choice-text">
                {String.fromCharCode(65 + choiceIndex)}. {choice.text}
              </span>
              {state === 'correct' && <CircleCheck size={18} className="choice-status" />}
              {state === 'incorrect' && <CircleX size={18} className="choice-status" />}
            </button>
          )
        })}
      </div>

      {answer ? (
        <Button fullWidth onClick={onNext}>
          {isLast ? 'See Results' : 'Next Question'} <ArrowRight size={18} />
        </Button>
      ) : (
        <Button fullWidth onClick={onSubmit} disabled={!selectedChoiceId}>
          Submit Answer
        </Button>
      )}
    </div>
  )
}

export default QuizQuestion
