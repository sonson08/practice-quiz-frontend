import { Brain } from 'lucide-react'
import Card from '@/components/common/Card'
import QuizQuestion from '@/components/study/QuizQuestion'
import QuizResult from '@/components/study/QuizResult'
import QuizUnavailable from '@/components/study/QuizUnavailable'
import { useStudySession } from '@/hooks/useStudySession'

function QuizCard() {
  const {
    guide,
    quizStatus,
    quizError,
    currentQuestionIndex,
    selectedChoiceId,
    answers,
    isQuizFinished,
    regenerateQuiz,
    selectChoice,
    submitAnswer,
    nextQuestion,
    retakeQuiz,
    goToSummary,
    reset,
  } = useStudySession()

  const questions = guide?.questions ?? []
  const question = questions[currentQuestionIndex]

  const renderContent = () => {
    if (quizStatus === 'loading' || !question) {
      return (
        <QuizUnavailable
          isLoading={quizStatus === 'loading'}
          message={quizError}
          onRetry={regenerateQuiz}
          onBack={goToSummary}
        />
      )
    }
    if (isQuizFinished) {
      return (
        <QuizResult
          score={answers.filter((a) => a.isCorrect).length}
          total={questions.length}
          onRetake={retakeQuiz}
          onReviewSummary={goToSummary}
          onNewNotes={reset}
        />
      )
    }
    return (
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
    )
  }

  return (
    <Card id="quick-quiz" title="Quick Quiz" icon={<Brain size={18} />} iconTone="green" className="quiz-card">
      {renderContent()}
    </Card>
  )
}

export default QuizCard
