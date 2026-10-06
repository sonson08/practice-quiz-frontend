import { BookText } from 'lucide-react'
import Card from '@/components/common/Card'
import type { StudyGuide } from '@/types/studyGuide'

interface SummaryCardProps {
  guide: StudyGuide
}

function SummaryCard({ guide }: SummaryCardProps) {
  return (
    <Card id="ai-summary" title="AI Summary" icon={<BookText size={18} />} iconTone="purple" className="summary-card">
      <div className="summary-content">
        <p>{guide.summary.join(' ')}</p>

        <h3 className="summary-heading">Key Concepts</h3>
        <ul className="concept-list">
          {guide.keyConcepts.map((concept) => (
            <li key={concept}>{concept}</li>
          ))}
        </ul>

        <h3 className="summary-heading">Important Terms</h3>
        <ul className="term-chips">
          {guide.importantTerms.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

export default SummaryCard
