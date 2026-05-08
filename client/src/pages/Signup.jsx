import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaCircleNotch, FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async e => {
    e.preventDefault()
    if (form.name.trim().length === 0 || form.password.trim().length === 0) {
      toast.error('Please fill the required fields')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/signup', form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-sm border border-slate-200 p-8'>
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-slate-500 mb-2'>Create Account</h1>
            <p className='text-slate-600 text-sm'>Sign up to start managing your projects</p>
          </div>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Full Name</label>
              <input
                name='name'
                type='text'
                placeholder='Your name'
                value={form.name}
                onChange={handleChange}
                required
                className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md focus:outline-none text-slate-900 placeholder-slate-400' />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Email Address</label>
              <input
                name='email'
                type='email'
                placeholder='name@company.com'
                value={form.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md focus:outline-none text-slate-900 placeholder-slate-400' />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Password</label>
              <div className='relative'>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Create a password'
                  value={form.password}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-2.5 bg-white border border-slate-300 focus:outline-none rounded-md text-slate-900 placeholder-slate-400 pr-11' />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition'>
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full cursor-pointer py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150'>
              {loading ? (
                <span className='flex items-center justify-center'>
                  <FaCircleNotch size={16} className='animate-spin -ml-1 mr-2' />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
          <p className='mt-6 text-center text-sm text-slate-600'>
            {'Already have an account? '}
            <Link to='/login' className='text-blue-600 hover:text-blue-700 font-medium'>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Signup