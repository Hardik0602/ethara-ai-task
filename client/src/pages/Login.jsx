import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaCircleNotch, FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-sm border border-slate-200 p-8'>
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-slate-500 mb-2'>Log In</h1>
            <p className='text-slate-600 text-sm'>Enter your credentials to access your account</p>
          </div>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Email Address</label>
              <input
                name='email'
                type='email'
                placeholder='name@company.com'
                value={form.email}
                onChange={handleChange}
                required
                className='w-full focus:outline-none px-4 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400' />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Password</label>
              <div className='relative'>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={form.password}
                  onChange={handleChange}
                  required
                  className='w-full focus:outline-none px-4 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 pr-11' />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition'>
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            <button
              type='submit'
              disabled={loading}
              className='cursor-pointer w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150'>
              {loading ? (
                <span className='flex items-center justify-center'>
                  <FaCircleNotch size={16} className='animate-spin -ml-1 mr-2' />
                  Logging in...
                </span>
              ) : 'Log In'}
            </button>
          </form>
          <p className='mt-6 text-center text-sm text-slate-600'>
            {`Don't have an account? `}
            <Link to='/signup' className='text-blue-600 hover:text-blue-700 font-medium'>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Login