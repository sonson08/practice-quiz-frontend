import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout
