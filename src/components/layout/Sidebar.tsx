import { BookOpen, FilePlus2, History, House, Settings, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import { useStudySession } from '@/hooks/useStudySession'
import { PATHS } from '@/routes/paths'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navLinkClass = ({ isActive }: { isActive: boolean }) => `sidebar-link${isActive ? ' active' : ''}`

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { reset } = useStudySession()
  const navigate = useNavigate()

  const startNewSession = () => {
    reset()
    navigate(PATHS.HOME)
    onClose()
  }

  return (
    <>
      <div className={`sidebar-backdrop${isOpen ? ' visible' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar${isOpen ? ' open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <Logo />
          <button type="button" className="icon-button sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to={PATHS.HOME} end className={navLinkClass} onClick={onClose}>
            <House size={18} /> Home
          </NavLink>
          <button type="button" className="sidebar-link" onClick={startNewSession}>
            <FilePlus2 size={18} /> New Session
          </button>
          <NavLink to={PATHS.HISTORY} className={navLinkClass} onClick={onClose}>
            <History size={18} /> History
          </NavLink>
          <NavLink to={PATHS.SETTINGS} className={navLinkClass} onClick={onClose}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>

        <div className="sidebar-promo">
          <p>Turn your notes into a summary and interactive quiz!</p>
          <div className="sidebar-promo-art" aria-hidden="true">
            <BookOpen size={56} strokeWidth={1.5} />
          </div>
        </div>

        <p className="sidebar-version">AI Study Buddy v1.0</p>
      </aside>
    </>
  )
}

export default Sidebar
