import type { ReactNode } from 'react'

interface StepActionsProps {
  children: ReactNode
}

function StepActions({ children }: StepActionsProps) {
  return <div className="step-actions">{children}</div>
}

export default StepActions
