interface ProgressBarProps {
  value: number
  tone?: 'blue' | 'green'
  label?: string
}

function ProgressBar({ value, tone = 'blue', label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span className={`progress-fill tone-${tone}`} style={{ width: `${clamped}%` }} />
    </div>
  )
}

export default ProgressBar
