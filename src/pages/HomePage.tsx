import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import { PATHS } from '@/routes/paths'

function HomePage() {
  const navigate = useNavigate()

  return (
    <section>
      <h1>Practice Quiz</h1>
      <p>Test your knowledge with practice questions.</p>
      <Button onClick={() => navigate(PATHS.QUIZ)}>Start Quiz</Button>
    </section>
  )
}

export default HomePage
