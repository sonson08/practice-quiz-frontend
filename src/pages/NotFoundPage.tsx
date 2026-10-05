import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

function NotFoundPage() {
  return (
    <section>
      <h1>404 - Page not found</h1>
      <Link to={PATHS.HOME}>Back to home</Link>
    </section>
  )
}

export default NotFoundPage
