import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

function NotFoundPage() {
  return (
    <div className="study-page">
      <header className="page-header">
        <div>
          <h1>404 - Page not found</h1>
          <p className="page-subtitle">
            <Link to={PATHS.HOME}>Back to home</Link>
          </p>
        </div>
      </header>
    </div>
  )
}

export default NotFoundPage
