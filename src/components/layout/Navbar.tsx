import { NavLink } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

function Navbar() {
  return (
    <header className="navbar">
      <span className="navbar-brand">Practice Quiz</span>
      <nav className="navbar-links">
        <NavLink to={PATHS.HOME} end>
          Home
        </NavLink>
        <NavLink to={PATHS.QUIZ}>Quiz</NavLink>
      </nav>
    </header>
  )
}

export default Navbar
