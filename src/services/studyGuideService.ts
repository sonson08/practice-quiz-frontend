import { LOADING_STEPS, QUIZ_QUESTION_COUNT } from '@/constants/study'
import type { Question } from '@/types/quiz'
import type { StudyGuide, SummaryLength } from '@/types/studyGuide'
import { shuffle } from '@/utils/shuffle'

// Mock generator that runs entirely in the browser. Replace the body of
// generateStudyGuide with a call to the backend once the AI endpoint exists.

const STEP_DELAY_MS = 700

const STOP_WORDS = new Set(
  `a about above after again against all also although among an and any are as at be because been before being below
  between both but by can could did do does doing down during each either else even every few for from further had has
  have having he her here hers him his how however i if in into is it its itself just like many may me might more most
  much must my no nor not now of off often on once one only or other our ours out over own same she should since so some
  such than that the their theirs them then there these they this those through thus to too under until up upon us used
  using very was we were what when where which while who whom why will with within without would yet you your
  called known include includes including make makes made process another first second third different important`
    .split(/\s+/)
    .filter(Boolean),
)

const GENERIC_DISTRACTORS = [
  'Gravity',
  'Erosion',
  'Inflation',
  'Metaphor',
  'Algorithm',
  'Democracy',
  'Friction',
  'Mitosis',
]

const SAMPLE_GUIDE: StudyGuide = {
  summary: [
    'Photosynthesis is the process plants use to convert light energy into chemical energy stored in glucose.',
    'It takes place in the chloroplasts and requires sunlight, water, and carbon dioxide, releasing oxygen as a by-product.',
  ],
  keyConcepts: [
    'Sunlight is the primary energy source for photosynthesis',
    'Chlorophyll absorbs light inside the chloroplasts',
    'Glucose stores the chemical energy produced',
  ],
  importantTerms: ['Photosynthesis', 'Chlorophyll', 'Chloroplast', 'Glucose', 'Carbon Dioxide'],
  questions: [
    {
      id: 'sample-1',
      text: 'What is the primary energy source for photosynthesis?',
      choices: [
        { id: 'a', text: 'Water' },
        { id: 'b', text: 'Sunlight' },
        { id: 'c', text: 'Carbon Dioxide' },
        { id: 'd', text: 'Glucose' },
      ],
      correctChoiceId: 'b',
      explanation: 'Sunlight provides the energy needed to drive the photosynthesis process.',
    },
    {
      id: 'sample-2',
      text: 'Where in the plant cell does photosynthesis take place?',
      choices: [
        { id: 'a', text: 'Nucleus' },
        { id: 'b', text: 'Mitochondria' },
        { id: 'c', text: 'Chloroplast' },
        { id: 'd', text: 'Cell wall' },
      ],
      correctChoiceId: 'c',
      explanation: 'Chloroplasts contain chlorophyll, which captures light for photosynthesis.',
    },
    {
      id: 'sample-3',
      text: 'Which gas is released as a by-product of photosynthesis?',
      choices: [
        { id: 'a', text: 'Oxygen' },
        { id: 'b', text: 'Nitrogen' },
        { id: 'c', text: 'Carbon Dioxide' },
        { id: 'd', text: 'Hydrogen' },
      ],
      correctChoiceId: 'a',
      explanation: 'Plants release oxygen after splitting water molecules during photosynthesis.',
    },
    {
      id: 'sample-4',
      text: 'Which pigment absorbs light energy in plants?',
      choices: [
        { id: 'a', text: 'Melanin' },
        { id: 'b', text: 'Hemoglobin' },
        { id: 'c', text: 'Keratin' },
        { id: 'd', text: 'Chlorophyll' },
      ],
      correctChoiceId: 'd',
      explanation: 'Chlorophyll is the green pigment that absorbs light energy.',
    },
    {
      id: 'sample-5',
      text: 'What sugar is produced by photosynthesis?',
      choices: [
        { id: 'a', text: 'Sucrose' },
        { id: 'b', text: 'Glucose' },
        { id: 'c', text: 'Lactose' },
        { id: 'd', text: 'Fructose' },
      ],
      correctChoiceId: 'b',
      explanation: 'Photosynthesis produces glucose, which stores chemical energy for the plant.',
    },
  ],
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const toTitleCase = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

function splitSentences(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(' ').length >= 5)
}

function extractTerms(text: string) {
  const counts = new Map<string, { count: number; display: string }>()

  for (const match of text.matchAll(/[A-Za-z][A-Za-z-]{3,}/g)) {
    const word = match[0]
    const key = word.toLowerCase()
    if (STOP_WORDS.has(key)) continue

    const entry = counts.get(key)
    const isCapitalized = word[0] === word[0].toUpperCase()
    if (entry) {
      entry.count += 1
      if (isCapitalized) entry.display = word
    } else {
      counts.set(key, { count: 1, display: isCapitalized ? word : toTitleCase(word) })
    }
  }

  return [...counts.entries()]
    .sort(([a, x], [b, y]) => y.count - x.count || b.length - a.length)
    .map(([, { display }]) => display)
}

function scoreSentence(sentence: string, terms: string[]) {
  const lower = sentence.toLowerCase()
  return terms.reduce(
    (score, term, index) => (lower.includes(term.toLowerCase()) ? score + (terms.length - index) : score),
    0,
  )
}

function pickTopSentences(sentences: string[], terms: string[], count: number) {
  return sentences
    .map((sentence, index) => ({ sentence, index, score: scoreSentence(sentence, terms) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map(({ sentence }) => sentence)
}

function buildQuestion(id: string, text: string, answer: string, distractors: string[], explanation: string): Question {
  const choices = shuffle([answer, ...shuffle(distractors).slice(0, 3)]).map((choice, index) => ({
    id: String.fromCharCode(97 + index),
    text: choice,
  }))

  return {
    id,
    text,
    choices,
    correctChoiceId: choices.find((choice) => choice.text === answer)!.id,
    explanation,
  }
}

function buildQuestions(sentences: string[], terms: string[]) {
  const questions: Question[] = []
  const usedSentences = new Set<string>()
  const quizTerms = terms.slice(0, 12)

  for (const term of quizTerms) {
    if (questions.length >= QUIZ_QUESTION_COUNT) break

    const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i')
    const sentence = sentences.find((s) => !usedSentences.has(s) && pattern.test(s))
    if (!sentence) continue

    usedSentences.add(sentence)
    const blanked = sentence.replace(new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi'), '_____')
    const distractors = quizTerms.filter((t) => t.toLowerCase() !== term.toLowerCase())

    questions.push(
      buildQuestion(
        `q-${questions.length + 1}`,
        `Which term best completes this statement? "${blanked}"`,
        term,
        distractors,
        sentence,
      ),
    )
  }

  const unused = quizTerms.filter((term) => !questions.some((q) => q.explanation.toLowerCase().includes(term.toLowerCase())))
  for (const term of unused) {
    if (questions.length >= QUIZ_QUESTION_COUNT) break
    const noteTerms = new Set(terms.map((t) => t.toLowerCase()))
    questions.push(
      buildQuestion(
        `q-${questions.length + 1}`,
        'Which of these is an important term from your notes?',
        term,
        GENERIC_DISTRACTORS.filter((d) => !noteTerms.has(d.toLowerCase())),
        `"${term}" is one of the key terms that appears in your notes.`,
      ),
    )
  }

  return questions
}

function buildStudyGuide(notes: string, length: SummaryLength): StudyGuide {
  const sentences = splitSentences(notes)
  const terms = extractTerms(notes)

  if (sentences.length < 2 || terms.length < 4) return SAMPLE_GUIDE

  const isDetailed = length === 'detailed'
  const summary = pickTopSentences(sentences, terms, isDetailed ? 4 : 2)
  const keyConcepts = pickTopSentences(
    sentences.filter((s) => !summary.includes(s)),
    terms,
    isDetailed ? 5 : 3,
  ).map((s) => (s.length > 110 ? `${s.slice(0, 107).trimEnd()}...` : s))

  return {
    summary,
    keyConcepts: keyConcepts.length > 0 ? keyConcepts : summary,
    importantTerms: terms.slice(0, isDetailed ? 8 : 5),
    questions: buildQuestions(sentences, terms),
  }
}

export async function generateStudyGuide(
  notes: string,
  length: SummaryLength,
  onProgress?: (stepIndex: number) => void,
): Promise<StudyGuide> {
  for (let step = 0; step < LOADING_STEPS.length; step++) {
    onProgress?.(step)
    await wait(STEP_DELAY_MS)
  }
  return buildStudyGuide(notes, length)
}
