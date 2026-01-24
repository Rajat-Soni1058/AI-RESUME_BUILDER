import React, { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon, XIcon, PencilIcon, FilePenLineIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api.js'

const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth)
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]

  const [allResumes, setAllResumes] = useState([])
  const [Scr, setScr] = useState(false)
  const [title, setTitle] = useState('')
  const [editResumeId, setEditResumeId] = useState('')

  const navigate = useNavigate()

  const loadallresume = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', {
        headers: { Authorization: token }
      })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResume = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.post(
        '/api/resumes/create',
        { title },
        { headers: { Authorization: token } }
      )
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setScr(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const editTitle = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.put(
        '/api/resumes/update',
        { resumeId: editResumeId, resumeData: { title } },
        { headers: { Authorization: token } }
      )
      setAllResumes(allResumes.map(resume =>
        resume._id === editResumeId ? { ...resume, title } : resume
      ))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteResume = async (resumeId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this resume?')
      if (confirmDelete) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token }
        })
        setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    loadallresume()
  }, [])

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">

        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, Joe Doe
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setScr(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length]

            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon className="size-7" style={{ color: baseColor }} />

                <p className="text-sm px-2 text-center" style={{ color: baseColor }}>
                  {resume.title}
                </p>

                <p className="absolute bottom-1 text-[11px]" style={{ color: baseColor + "90" }}>
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 hidden group-hover:flex items-center"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id)
                      setTitle(resume.title)
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700"
                  />
                </div>
              </button>
            )
          })}
        </div>

        {Scr && (
          <form
            onSubmit={createResume}
            onClick={() => setScr(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 cursor-pointer"
                onClick={() => {
                  setScr(false)
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}

        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 mb-4"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Update
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 cursor-pointer"
                onClick={() => {
                  setEditResumeId('')
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}

      </div>
    </div>
  )
}

export default Dashboard
