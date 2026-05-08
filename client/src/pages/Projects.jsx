import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { toast } from 'react-toastify'
import { TbClipboardOff } from 'react-icons/tb'
import { FaCircleNotch } from 'react-icons/fa'
const Projects = () => {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      setProjects(res.data)
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Failed to load projects')
    }
  }
  useEffect(() => { fetchProjects() }, [])
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleCancel = () => {
    setShowForm(!showForm)
    setForm({ name: '', description: '' })
  }
  const handleCreate = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/projects', form)
      setForm({ name: '', description: '' })
      setShowForm(false)
      toast.success('Project created successfully')
      fetchProjects()
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Failed to create project')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='min-h-screen bg-slate-50 flex justify-center p-4'>
      <div className='max-w-3xl w-full'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-500'>Projects</h1>
          <button
            onClick={() => handleCancel()}
            className='bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition'>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>
        {showForm && (
          <div className='border border-gray-200 rounded-xl p-5 mb-6 bg-white'>
            <h2 className='font-semibold text-gray-700 mb-4'>New Project</h2>
            <form onSubmit={handleCreate} className='flex flex-col gap-3'>
              <input
                name='name'
                placeholder='Project name'
                value={form.name}
                onChange={handleChange}
                required
                className='border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none' />
              <input
                name='description'
                placeholder='Description (optional)'
                value={form.description}
                onChange={handleChange}
                className='border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none' />
              <button
                type='submit'
                disabled={loading}
                className='cursor-pointer w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150'>
                {loading ? (
                  <span className='flex items-center justify-center'>
                    <FaCircleNotch size={16} className='animate-spin -ml-1 mr-2' />
                    Creating Project...
                  </span>
                ) : 'Create Project'}
              </button>
            </form>
          </div>
        )}
        {projects.length === 0 ? (
          <div className='py-30 text-gray-400'>
            <TbClipboardOff
              className='mx-auto mb-3'
              size={50} />
            <p className='font-medium text-center'>No projects found</p>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {projects.map(project => (
              <div
                key={project._id}
                onClick={() => navigate(`/${project._id}`)}
                className='border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md transition bg-white'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h3 className='font-semibold text-gray-500'>{project.name}</h3>
                    {project.description && (
                      <p className='text-gray-400 text-sm mt-1'>{project.description}</p>
                    )}
                  </div>
                  <div className='flex flex-col items-center'>
                    <p className='font-semibold text-gray-500'>
                      {project.members.length} Member{project.members.length !== 1 ? 's' : ''}
                    </p>
                    <p className='text-gray-400 text-sm mt-1'>Admin: {project.admin.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default Projects