import axiosClient from '@/api/axiosClient'
import type { Quiz } from '@/types/quiz'

export const quizApi = {
  getAll: async () => {
    const { data } = await axiosClient.get<Quiz[]>('/quizzes')
    return data
  },

  getById: async (id: string) => {
    const { data } = await axiosClient.get<Quiz>(`/quizzes/${id}`)
    return data
  },
}
