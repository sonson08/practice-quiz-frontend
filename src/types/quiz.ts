export interface Choice {
  id: string
  text: string
}

export interface Question {
  id: string
  text: string
  choices: Choice[]
  correctChoiceId: string
  explanation: string
}
