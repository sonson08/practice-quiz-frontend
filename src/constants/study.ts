export const MAX_NOTES_LENGTH = 20_000

export const MIN_NOTES_WORDS = 20

export const INSUFFICIENT_NOTES_MESSAGE =
  "We couldn't find enough study content in your notes. Please add more details about the topic and try again."

export const QUIZ_QUESTION_COUNT = 5

export const LOADING_STEPS = [
  'Understanding your notes',
  'Generating summary',
  'Creating quiz questions',
  'Almost done...',
] as const

export const WIZARD_STEPS = [
  'Paste Notes',
  'Generate',
  'Review Summary',
  'Take Quiz',
] as const
