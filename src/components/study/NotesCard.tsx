import { FileText, Sparkles } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { MAX_NOTES_LENGTH, MIN_NOTES_WORDS } from '@/constants/study'
import { useStudySession } from '@/hooks/useStudySession'
import { countWords } from '@/utils/countWords'

function NotesCard() {
  const { notes, status, error, setNotes, generate } = useStudySession()
  const isLoading = status === 'loading'
  const wordCount = countWords(notes)
  const hasEnoughWords = wordCount >= MIN_NOTES_WORDS
  const canGenerate = hasEnoughWords && !isLoading

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
      <div className="notes-meta">
        <p className="notes-hint">
          {wordCount > 0 && !hasEnoughWords
            ? `Add at least ${MIN_NOTES_WORDS - wordCount} more ${MIN_NOTES_WORDS - wordCount === 1 ? 'word' : 'words'} to generate.`
            : ''}
        </p>
        <p className="notes-counter">
          {notes.length.toLocaleString()} / {MAX_NOTES_LENGTH.toLocaleString()}
        </p>
      </div>

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
