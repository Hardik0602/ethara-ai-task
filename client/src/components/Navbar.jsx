import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiLogOut } from 'react-icons/fi'
import { FaRegUserCircle } from 'react-icons/fa'
import { useState } from 'react'
const Navbar = () => {
  const { user, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <nav className='bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center'>
      <Link to='/' className='font-bold text-slate-500 text-lg active:scale-[0.98] transition-all duration-150'>
        Task Manager
      </Link>
      <button
        className='cursor-pointer text-slate-500 text-xl hover:text-slate-700 active:scale-[0.98] transition-all duration-150'
        onClick={() => setShowProfileMenu(!showProfileMenu)}>
        <FaRegUserCircle />
      </button>
      {showProfileMenu && (
        <div className='absolute right-2 top-15 bg-white border border-slate-200 rounded-lg shadow-lg'>
          <div className='flex items-center justify-center gap-1 px-4 py-2 border-b border-slate-300'>
            <p className='font-bold text-slate-500'>Signed in as</p>
            <p className='font-semibold text-slate-400'>{user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className='flex cursor-pointer w-full items-center justify-center gap-1 p-2 font-bold text-slate-500 hover:text-red-500 transition'>
            <FiLogOut />
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
export default Navbar