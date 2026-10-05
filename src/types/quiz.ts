export interface Choice {
  id: string
  text: string
}

export interface Question {
  id: string
  text: string
  choices: Choice[]
  correctChoiceId: string
}

export interface Quiz {
  id: string
  title: string
  description?: string
  questions: Question[]
}
