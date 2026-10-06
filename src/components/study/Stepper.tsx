import { Check } from 'lucide-react'
import { WIZARD_STEPS } from '@/constants/study'

interface StepperProps {
  currentStep: number
  isStepEnabled?: (step: number) => boolean
  onStepClick?: (step: number) => void
}

function Stepper({ currentStep, isStepEnabled = () => false, onStepClick }: StepperProps) {
  return (
    <ol className="stepper" aria-label="Progress">
      {WIZARD_STEPS.map((label, index) => {
        const step = index + 1
        const state = step < currentStep ? 'complete' : step === currentStep ? 'active' : 'upcoming'
        const isClickable = step !== currentStep && isStepEnabled(step)
        const content = (
          <>
            <span className="stepper-circle">{state === 'complete' ? <Check size={16} /> : step}</span>
            <span className="stepper-label">{label}</span>
          </>
        )

        return (
          <li key={label} className={`stepper-item ${state}`} aria-current={state === 'active' ? 'step' : undefined}>
            {isClickable ? (
              <button type="button" className="stepper-button" onClick={() => onStepClick?.(step)}>
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default Stepper
