import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { toast } from 'react-toastify'
import { TbClipboardOff } from 'react-icons/tb'
import { FaArrowLeft } from 'react-icons/fa'
const Dashboard = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [projectName, setProjectName] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, projectRes] = await Promise.all([
          api.get(`/tasks/dashboard/${id}`),
          api.get(`/projects/${id}`)
        ])
        setData(dashRes.data)
        setProjectName(projectRes.data.name)
      } catch (err) {
        console.log(err.response?.data?.message)
        toast.error('Failed to load dashboard')
      }
    }
    fetchData()
  }, [id])
  if (!data) return (
    <div className='min-h-screen flex flex-col justify-center text-gray-400'>
      <TbClipboardOff
        className='mx-auto mb-3'
        size={50} />
      <p className='font-medium text-center'>No projects found</p>
    </div>
  )
  const statCards = [
    { label: 'Total Tasks', value: data.total },
    { label: 'To Do', value: data.byStatus['To Do'] },
    { label: 'In Progress', value: data.byStatus['In Progress'] },
    { label: 'Done', value: data.byStatus['Done'] }
  ]
  return (
    <div className='min-h-screen bg-slate-50 flex justify-center p-4'>
      <div className='max-w-3xl w-full'>
        <div className='mb-6'>
          <button
            onClick={() => navigate(`/${id}`)}
            className='inline-flex gap-1 items-center text-slate-600 hover:text-slate-400 transition mb-4 cursor-pointer'>
            <FaArrowLeft size={15} />
            <span className='font-medium'>Back</span>
          </button>
          <h1 className='text-2xl font-bold text-slate-500'>Dashboard</h1>
          <p className='text-gray-400 text-md mt-1'>{projectName}</p>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          {statCards.map(card => (
            <div key={card.label} className='border border-gray-200 rounded-xl p-4 text-center bg-white hover:shadow-md transition'>
              <p className='text-3xl font-bold text-gray-400'>{card.value}</p>
              <p className='text-gray-500 font-bold text-xs mt-2'>{card.label}</p>
            </div>
          ))}
        </div>
        <div className='flex items-center justify-between border border-gray-200 rounded-xl p-5 mb-6 bg-white hover:shadow-md transition'>
          <h2 className='font-bold text-gray-500'>Overdue Tasks</h2>
          {data.overdue === 0 ? (
            <p className='text-green-600 font-semibold text-md'>No overdue tasks!</p>
          ) : (
            <div className='inline-flex items-center gap-1 font-semibold text-md text-red-400'>
              <p>{data.overdue}</p>
              <p>Task{data.overdue !== 1 ? 's' : ''} past due date</p>
            </div>
          )}
        </div>
        <div className='border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition'>
          <h2 className='font-semibold text-gray-500 mb-4'>Tasks per Member</h2>
          {Object.keys(data.perUser).length === 0 ? (
            <p className='text-gray-400 text-md font-semibold text-center'>No tasks found</p>
          ) : (
            <div className='flex flex-col gap-5'>
              {Object.entries(data.perUser).map(([name, count]) => (
                <div key={name}>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-sm font-semibold text-gray-500'>{name}</span>
                    <span className='text-sm font-semibold text-gray-400'>{count} Task{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className='w-full bg-gray-100 rounded-full h-2'>
                    <div
                      className='bg-blue-500 h-2 rounded-full transition-all'
                      style={{ width: `${(count / data.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Dashboard