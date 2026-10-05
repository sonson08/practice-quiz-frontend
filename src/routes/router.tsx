import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import HomePage from '@/pages/HomePage'
import HistoryPage from '@/pages/HistoryPage'
import SettingsPage from '@/pages/SettingsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { PATHS } from '@/routes/paths'

export const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: PATHS.HISTORY, element: <HistoryPage /> },
      { path: PATHS.SETTINGS, element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
