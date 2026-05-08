import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { FaArrowLeft, FaCircleNotch } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { IoMdRemoveCircleOutline } from 'react-icons/io'
import { TbClipboardOff } from 'react-icons/tb'
const ProjectDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' })
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`)
      setProject(res.data)
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Failed to fetch project')
    }
  }
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/project/${id}`)
      setTasks(res.data)
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Failed to fetch tasks')
    }
  }
  useEffect(() => {
    fetchProject()
    fetchTasks()
  }, [id])
  const isAdmin = project?.admin?._id === user?.id
  const handleTaskChange = e => setTaskForm({ ...taskForm, [e.target.name]: e.target.value })
  const handleCreateTask = async e => {
    e.preventDefault()
    try {
      await api.post(`/tasks/project/${id}`, taskForm)
      setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' })
      setShowTaskForm(false)
      toast.success('Task created successfully')
      fetchTasks()
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Failed to create task')
    }
  }
  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status })
      toast.success('Status updated successfully')
      fetchTasks()
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Failed to update status')
    }
  }
  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      toast.success('Task deleted successfully')
      fetchTasks()
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Failed to delete task')
    }
  }
  const handleAddMember = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail })
      handleCancelAddMember()
      toast.success('Member added successfully')
      fetchProject()
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Failed to add member')
    } finally {
      setLoading(false)
    }
  }
  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/projects/${id}/members/${userId}`)
      toast.success('Member removed successfully')
      fetchProject()
    } catch (err) {
      console.log(err.response?.data?.message)
      toast.error('Failed to remove member')
    }
  }
  const handleCancelAddMember = () => {
    setShowMemberForm(!showMemberForm)
    setMemberEmail('')
  }
  const handleCancelNewTask = () => {
    setShowTaskForm(!showTaskForm)
    setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' })
  }
  const priorityBadge = {
    'Low': 'bg-green-100 text-green-700',
    'Medium': 'bg-yellow-100 text-yellow-700',
    'High': 'bg-red-100 text-red-700',
  }
  const visibleTasks = isAdmin
    ? tasks
    : tasks.filter(task => task?.assignedTo?._id === user?.id)
  if (!project) return (
    <div className='min-h-screen flex flex-col justify-center text-gray-400'>
      <TbClipboardOff
        className='mx-auto mb-3'
        size={50} />
      <p className='font-medium text-center'>No projects found</p>
    </div>
  )
  return (
    <div className='min-h-screen bg-slate-50 flex justify-center p-4'>
      <div className='max-w-3xl w-full'>
        <div className='flex flex-col mb-6'>
          <button
            onClick={() => navigate('/')}
            className='inline-flex gap-1 items-center text-slate-600 hover:text-slate-400 transition mb-4 cursor-pointer'>
            <FaArrowLeft size={15} />
            <span className='font-medium'>Back</span>
          </button>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-slate-500'>{project.name}</h1>
              {project.description && <p className='text-gray-400 text-md mt-1'>{project.description}</p>}
            </div>
            {isAdmin && <button
              onClick={() => navigate(`/${id}/dashboard`)}
              className='bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition'>
              Dashboard
            </button>}
          </div>
        </div>
        <div className='border border-gray-200 rounded-xl p-5 mb-6 bg-white'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold text-slate-500'>Members</h2>
            {isAdmin && (
              <button
                onClick={() => handleCancelAddMember()}
                className='bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition'>
                {showMemberForm ? 'Cancel' : '+ Add Member'}
              </button>
            )}
          </div>
          {showMemberForm && (
            <form onSubmit={handleAddMember} className='flex gap-2 mb-4'>
              <input
                type='email'
                placeholder='Member email'
                value={memberEmail}
                onChange={e => setMemberEmail(e.target.value)}
                required
                className='border border-gray-200 px-3 py-2 rounded-lg flex-1 text-sm focus:outline-none' />
              <button
                disabled={loading}
                type='submit'
                className='bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-150'>
                {loading ? (
                  <span className='flex items-center justify-center'>
                    <FaCircleNotch size={16} className='animate-spin -ml-1 mr-2' />
                    Adding Member...
                  </span>
                ) : 'Add Member'}
              </button>
            </form>
          )}
          <div className='flex flex-wrap gap-2'>
            {project.members.map(member => (
              <div
                key={member._id}
                className={`flex items-center font-semibold gap-1 px-3 py-1.5 rounded-lg text-sm ${member._id === project.admin._id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {member.name}
                {(isAdmin && member._id !== project.admin._id) && (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className='text-red-400 cursor-pointer hover:text-red-600'>
                    <IoMdRemoveCircleOutline size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-slate-500'>Tasks</h2>
          {isAdmin && (
            <button
              onClick={() => handleCancelNewTask()}
              className='bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition'>
              {showTaskForm ? 'Cancel' : '+ New Task'}
            </button>
          )}
        </div>
        {showTaskForm && (
          <div className='border border-gray-200 rounded-xl p-5 mb-6 bg-white'>
            <h3 className='font-semibold text-gray-500 mb-4'>New Task</h3>
            <form onSubmit={handleCreateTask} className='flex flex-col gap-3'>
              <input
                name='title'
                placeholder='Task title'
                value={taskForm.title}
                onChange={handleTaskChange}
                required
                className='border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none' />
              <input
                name='description'
                placeholder='Description (optional)'
                value={taskForm.description}
                onChange={handleTaskChange}
                className='border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none' />
              <input
                name='dueDate'
                type='date'
                value={taskForm.dueDate}
                onChange={handleTaskChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className='border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none' />
              <select
                name='priority'
                value={taskForm.priority}
                onChange={handleTaskChange}
                className='border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none'>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <select
                name='assignedTo'
                value={taskForm.assignedTo}
                onChange={handleTaskChange}
                required
                className='border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none'>
                <option value=''>Select member to assign</option>
                {project.members.map(member => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
              <button
                type='submit'
                disabled={loading}
                className='cursor-pointer w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150'>
                {loading ? (
                  <span className='flex items-center justify-center'>
                    <FaCircleNotch size={16} className='animate-spin -ml-1 mr-2' />
                    Adding Task...
                  </span>
                ) : 'Add Task'}
              </button>
            </form>
          </div>
        )}
        {visibleTasks.length === 0 ? (
          <div className='py-16 text-gray-400'>
            <TbClipboardOff
              className='mx-auto mb-3'
              size={50} />
            <p className='font-medium text-center'>No tasks found</p>
            {isAdmin && <p className='text-sm font-semibold text-center mt-1'>Create one to get started</p>}
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {visibleTasks.map(task => (
              <div key={task._id} className='border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition'>
                <div className='flex justify-between'>
                  <div className='flex flex-col justify-evenly'>
                    <div>
                      <h3 className='font-semibold text-gray-500'>{task.title}</h3>
                      {task.description && (
                        <p className='text-gray-400 text-sm mt-1'>{task.description}</p>
                      )}
                    </div>
                    <div className='flex gap-2 mt-3'>
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${priorityBadge[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className='text-xs px-2 py-1 font-medium rounded-md bg-gray-100 text-gray-700'>
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {task.assignedTo && (
                        <span className='text-xs px-2 py-1 font-medium rounded-md bg-blue-100 text-blue-700'>
                          {task.assignedTo.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col justify-evenly items-center gap-5'>
                    {(isAdmin || user.id === task?.assignedTo?._id) && (
                      <select
                        value={task.status}
                        onChange={e => handleStatusChange(task._id, e.target.value)}
                        className={`text-xs px-2 py-1.5 rounded-lg font-medium border-0 cursor-pointer bg-gray-100 text-gray-600`}>
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className='bg-red-600 cursor-pointer text-white px-2 py-1.5 rounded-lg hover:bg-red-700 text-sm font-medium transition'>
                        Delete Task
                      </button>
                    )}
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
export default ProjectDetail