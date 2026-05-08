import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer
        autoClose={3000}
        closeOnClick
        pauseOnHover={false}
        newestOnTop />
      <App />
    </AuthProvider>
  </StrictMode>
)