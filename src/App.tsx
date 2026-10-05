import { RouterProvider } from 'react-router-dom'
import { StudySessionProvider } from '@/context/StudySessionProvider'
import { router } from '@/routes/router'

function App() {
  return (
    <StudySessionProvider>
      <RouterProvider router={router} />
    </StudySessionProvider>
  )
}

export default App
