// Local stand-in for the backend (node-express-js-prisma-psql-boilerplate).
// Implements the contract in the backend's docs/API.md so the frontend can be tested without
// Docker, PostgreSQL, or AWS credentials.
//
//   npm run mock:api                     summaries and quizzes (matches the backend today)
//   npm run mock:api -- --summaries-only  no /quizzes endpoint
//
// Put "[llm-error]" in the notes to make both endpoints return 502 LLM_ERROR,
// or "[quiz-error]" to make only /quizzes fail.

import http from 'node:http'

const PORT = Number(process.env.PORT) || 3000
const DELAY_MS = Number(process.env.MOCK_DELAY_MS) || 1500
const MAX_NOTES_LENGTH = 20_000
const SUMMARIES_ONLY = process.argv.includes('--summaries-only')

const STOP_WORDS = new Set(
  'a an and are as at be by for from has have in into is it its of on or that the their this to was were which with'.split(' '),
)

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

const sendError = (res, status, code, message) => send(res, status, { error: { code, message } })

const readJson = (req) =>
  new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        reject(new Error('invalid json'))
      }
    })
  })

function validateNotes(notes) {
  if (notes === undefined || notes === null) return 'notes is required'
  if (typeof notes !== 'string') return 'notes must be a string'
  if (notes.trim().length === 0) return 'notes must not be empty'
  if (notes.trim().length > MAX_NOTES_LENGTH) return 'notes must be at most 20,000 characters'
  return null
}

const sentencesOf = (notes) =>
  notes
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(' ').length >= 4)

function termsOf(notes) {
  const counts = new Map()
  for (const [word] of notes.matchAll(/[A-Za-z][A-Za-z-]{3,}/g)) {
    const key = word.toLowerCase()
    if (STOP_WORDS.has(key)) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))
}

function buildSummary(notes) {
  const sentences = sentencesOf(notes)
  const fallback = notes.trim().slice(0, 200)
  return {
    summary: sentences.slice(0, 3).join(' ') || fallback,
    keyPoints: (sentences.length > 3 ? sentences.slice(3, 8) : sentences).slice(0, 5),
    terms: termsOf(notes).slice(0, 5),
  }
}

function buildQuiz(notes, questionCount) {
  const sentences = sentencesOf(notes)
  const terms = termsOf(notes)
  const keys = ['A', 'B', 'C', 'D']
  const fillers = ['Gravity', 'Erosion', 'Inflation', 'Metaphor', 'Friction', 'Mitosis']

  return Array.from({ length: questionCount }, (_, index) => {
    const term = terms[index % Math.max(terms.length, 1)] ?? 'Notes'
    const sentence = sentences.find((s) => s.toLowerCase().includes(term.toLowerCase())) ?? sentences[0] ?? notes
    const distractors = [...terms.filter((t) => t !== term), ...fillers].slice(index, index + 3)
    const correctIndex = index % 4
    const options = [...distractors]
    options.splice(correctIndex, 0, term)

    return {
      id: index + 1,
      question: `Which term best fits this statement? "${sentence.replace(new RegExp(term, 'gi'), '_____')}"`,
      choices: options.slice(0, 4).map((text, i) => ({ key: keys[i], text })),
      correctAnswer: keys[correctIndex],
      explanation: sentence,
    }
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const route = `${req.method} ${url.pathname.replace(/\/$/, '')}`
  console.log(new Date().toLocaleTimeString(), route)

  const isSummary = route === 'POST /api/v1/summaries'
  const isQuiz = route === 'POST /api/v1/quizzes' && !SUMMARIES_ONLY
  if (!isSummary && !isQuiz) return sendError(res, 404, 'NOT_FOUND', 'Not found')

  let body
  try {
    body = await readJson(req)
  } catch {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Request body must be valid JSON')
  }

  const notesError = validateNotes(body.notes)
  if (notesError) return sendError(res, 400, 'VALIDATION_ERROR', notesError)

  const notes = body.notes.trim()
  await wait(isSummary ? DELAY_MS : DELAY_MS * 2)

  if (notes.includes('[llm-error]') || (isQuiz && notes.includes('[quiz-error]'))) {
    const message = isSummary ? 'Could not generate a summary. Please try again.' : 'Could not generate a quiz. Please try again.'
    return sendError(res, 502, 'LLM_ERROR', message)
  }

  if (isSummary) return send(res, 200, { data: buildSummary(notes) })

  const questionCount = body.questionCount ?? 10
  if (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > 20) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'questionCount must be an integer between 1 and 20')
  }
  return send(res, 200, { data: { questions: buildQuiz(notes, questionCount) } })
})

server.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}/api/v1`)
  console.log(SUMMARIES_ONLY ? 'Mode: summaries only' : 'Mode: summaries and quizzes')
})
