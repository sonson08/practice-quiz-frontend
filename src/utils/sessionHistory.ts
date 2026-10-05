import type { SessionRecord } from '@/types/studyGuide'

const STORAGE_KEY = 'ai-study-buddy:history'

export function getSessionHistory(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SessionRecord[]) : []
  } catch {
    return []
  }
}

export function saveSessionRecord(record: SessionRecord) {
  const history = [record, ...getSessionHistory()].slice(0, 50)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function clearSessionHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
