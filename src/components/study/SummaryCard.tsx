import { BookText } from 'lucide-react'
import Card from '@/components/common/Card'
import Skeleton from '@/components/common/Skeleton'
import type { StudyGuide } from '@/types/studyGuide'

interface SummaryCardProps {
  guide: StudyGuide | null
}

function SummaryPlaceholder() {
  return (
    <div className="summary-placeholder">
      <div className="skeleton-stack">
        <Skeleton width="92%" />
        <Skeleton width="78%" />
        <Skeleton width="64%" />
      </div>

      <h3 className="summary-heading">Key Concepts</h3>
      <ul className="skeleton-list">
        {['70%', '58%', '64%'].map((width) => (
          <li key={width}>
            <span className="skeleton-dot" />
            <Skeleton width={width} />
          </li>
        ))}
      </ul>

      <h3 className="summary-heading">Important Terms</h3>
      <div className="skeleton-chips">
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} width="22%" height={22} />
        ))}
      </div>
    </div>
  )
}

function SummaryCard({ guide }: SummaryCardProps) {
  return (
    <Card id="ai-summary" title="AI Summary" icon={<BookText size={18} />} iconTone="purple" className="summary-card">
      {guide ? (
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
      ) : (
        <SummaryPlaceholder />
      )}
    </Card>
  )
}

export default SummaryCard
