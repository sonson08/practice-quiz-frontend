import { useState } from 'react'
import { History, Trash2 } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { clearSessionHistory, getSessionHistory } from '@/utils/sessionHistory'

function HistoryPage() {
  const [history, setHistory] = useState(getSessionHistory)

  const clearHistory = () => {
    clearSessionHistory()
    setHistory([])
  }

  return (
    <div className="study-page">
      <header className="page-header">
        <div>
          <h1>History</h1>
          <p className="page-subtitle">Your completed quizzes on this device.</p>
        </div>
        {history.length > 0 && (
          <Button variant="outline" onClick={clearHistory}>
            <Trash2 size={16} /> Clear
          </Button>
        )}
      </header>

      <Card title="Past Sessions" icon={<History size={18} />}>
        {history.length === 0 ? (
          <p className="muted">No completed quizzes yet. Finish a quiz and it will show up here.</p>
        ) : (
          <ul className="history-list">
            {history.map((record) => (
              <li key={record.id} className="history-item">
                <div>
                  <p className="history-preview">{record.preview || 'Untitled notes'}</p>
                  <p className="muted">{new Date(record.createdAt).toLocaleString()}</p>
                </div>
                <span className="history-score">
                  {record.score} / {record.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

export default HistoryPage
