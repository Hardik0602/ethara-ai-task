import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Dashboard from './pages/Dashboard'
import AppLayout from './layout/AppLayout'
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route
        path='/'
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }>
        <Route index element={<Projects />} />
        <Route path=':id' element={<ProjectDetail />} />
        <Route path=':id/dashboard' element={<Dashboard />} />
      </Route>
    </>
  )
)
export default function App() {
  return <RouterProvider router={router} />
}