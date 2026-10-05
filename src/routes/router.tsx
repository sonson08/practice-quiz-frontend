import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import HomePage from '@/pages/HomePage'
import QuizPage from '@/pages/QuizPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { PATHS } from '@/routes/paths'

export const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: PATHS.QUIZ, element: <QuizPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
