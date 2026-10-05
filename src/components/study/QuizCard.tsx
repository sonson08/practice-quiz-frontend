import { Brain } from 'lucide-react'
import Card from '@/components/common/Card'
import QuizEmpty from '@/components/study/QuizEmpty'
import QuizQuestion from '@/components/study/QuizQuestion'
import QuizResult from '@/components/study/QuizResult'
import { useStudySession } from '@/hooks/useStudySession'

function QuizCard() {
  const {
    guide,
    currentQuestionIndex,
    selectedChoiceId,
    answers,
    isQuizFinished,
    selectChoice,
    submitAnswer,
    nextQuestion,
    retryQuiz,
  } = useStudySession()

  const questions = guide?.questions ?? []
  const question = questions[currentQuestionIndex]

  const reviewSummary = () => {
    document.getElementById('ai-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Card id="quick-quiz" title="Quick Quiz" icon={<Brain size={18} />} iconTone="green" className="quiz-card">
      {!question ? (
        <QuizEmpty />
      ) : isQuizFinished ? (
        <QuizResult
          score={answers.filter((a) => a.isCorrect).length}
          total={questions.length}
          onRetry={retryQuiz}
          onReviewSummary={reviewSummary}
        />
      ) : (
        <QuizQuestion
          question={question}
          index={currentQuestionIndex}
          total={questions.length}
          selectedChoiceId={selectedChoiceId}
          answer={answers.find((a) => a.questionId === question.id)}
          onSelect={selectChoice}
          onSubmit={submitAnswer}
          onNext={nextQuestion}
        />
      )}
    </Card>
  )
}

export default QuizCard
