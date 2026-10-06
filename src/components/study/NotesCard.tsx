import { FileText, Sparkles } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { MAX_NOTES_LENGTH } from '@/constants/study'
import { useStudySession } from '@/hooks/useStudySession'

function NotesCard() {
  const { notes, status, error, setNotes, generate } = useStudySession()
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
