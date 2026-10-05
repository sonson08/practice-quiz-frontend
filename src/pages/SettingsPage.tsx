import { Settings } from 'lucide-react'
import Card from '@/components/common/Card'

function SettingsPage() {
  return (
    <div className="study-page">
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Customize your study experience.</p>
        </div>
      </header>

      <Card title="Preferences" icon={<Settings size={18} />}>
        <p className="muted">Settings are coming soon.</p>
      </Card>
    </div>
  )
}

export default SettingsPage
