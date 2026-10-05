import { Check, Sparkles } from 'lucide-react'
import { LOADING_STEPS } from '@/constants/study'

interface LoadingPanelProps {
  currentStep: number
}

function LoadingPanel({ currentStep }: LoadingPanelProps) {
  return (
    <section className="loading-panel" aria-live="polite" aria-busy="true">
      <span className="loading-badge">
        <Sparkles size={28} />
      </span>
      <h2>AI is analyzing your notes...</h2>
      <p>This may take a few seconds.</p>

      <ul className="loading-steps">
        {LOADING_STEPS.map((label, index) => {
          const state = index < currentStep ? 'done' : index === currentStep ? 'active' : 'pending'
          return (
            <li key={label} className={`loading-step ${state}`}>
              <span className="loading-step-icon">{state === 'done' && <Check size={14} />}</span>
              {label}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default LoadingPanel
