import type { ReactNode } from 'react'

interface CardProps {
  title: string
  icon: ReactNode
  iconTone?: 'blue' | 'purple' | 'green'
  className?: string
  id?: string
  children: ReactNode
}

function Card({ title, icon, iconTone = 'blue', className = '', id, children }: CardProps) {
  return (
    <section id={id} className={`card ${className}`.trim()}>
      <header className="card-header">
        <span className={`card-icon tone-${iconTone}`}>{icon}</span>
        <h2 className="card-title">{title}</h2>
      </header>
      {children}
    </section>
  )
}

export default Card
