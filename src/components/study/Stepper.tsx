import { Check } from 'lucide-react'
import { WIZARD_STEPS } from '@/constants/study'

interface StepperProps {
  currentStep: number
}

function Stepper({ currentStep }: StepperProps) {
  return (
    <ol className="stepper" aria-label="Progress">
      {WIZARD_STEPS.map((label, index) => {
        const step = index + 1
        const state = step < currentStep ? 'complete' : step === currentStep ? 'active' : 'upcoming'
        return (
          <li key={label} className={`stepper-item ${state}`} aria-current={state === 'active' ? 'step' : undefined}>
            <span className="stepper-circle">{state === 'complete' ? <Check size={16} /> : step}</span>
            <span className="stepper-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default Stepper
