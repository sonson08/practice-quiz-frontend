import { FileText, Sparkles } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { MAX_NOTES_LENGTH } from '@/constants/study'
import { useStudySession } from '@/hooks/useStudySession'
import type { SummaryLength } from '@/types/studyGuide'

const LENGTH_OPTIONS: { value: SummaryLength; label: string; hint: string }[] = [
  { value: 'short', label: 'Short', hint: '(key points only)' },
  { value: 'detailed', label: 'Detailed', hint: '(more comprehensive)' },
]

function NotesCard() {
  const { notes, summaryLength, status, error, setNotes, setSummaryLength, generate } = useStudySession()
  const isLoading = status === 'loading'
  const canGenerate = notes.trim().length > 0 && !isLoading

  return (
    <Card title="Your Notes" icon={<FileText size={18} />} className="notes-card">
      <label htmlFor="notes" className="visually-hidden">
        Your notes
      </label>
      <textarea
        id="notes"
        className="notes-input"
        placeholder="Paste your lesson, reviewer, or study notes here..."
        value={notes}
        maxLength={MAX_NOTES_LENGTH}
        onChange={(event) => setNotes(event.target.value)}
        disabled={isLoading}
      />
      <p className="notes-counter">
        {notes.length.toLocaleString()} / {MAX_NOTES_LENGTH.toLocaleString()}
      </p>

      <fieldset className="length-options" disabled={isLoading}>
        <legend>Summary Length</legend>
        {LENGTH_OPTIONS.map((option) => (
          <label key={option.value} className="radio">
            <input
              type="radio"
              name="summaryLength"
              value={option.value}
              checked={summaryLength === option.value}
              onChange={() => setSummaryLength(option.value)}
            />
            <span className="radio-mark" aria-hidden="true" />
            <span>
              {option.label} <span className="radio-hint">{option.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <Button fullWidth onClick={generate} disabled={!canGenerate}>
        <Sparkles size={18} /> Generate Study Guide
      </Button>
    </Card>
  )
}

export default NotesCard
