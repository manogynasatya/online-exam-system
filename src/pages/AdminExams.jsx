import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AdminExams = () => {
  const [exams, setExams] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    durationMinutes: 60,
    totalMarks: 100,
    passMarks: 50,
    totalQuestions: 10,
    level: 'EASY',
    startTime: '',
    endTime: ''
  })

  useEffect(() => {
    fetchExams()
    fetchSubjects()
  }, [])

  const fetchExams = async () => {
    try {
      const response = await api.get('/api/admin/exams')
      setExams(response.data)
    } catch (error) {
      console.error('Error fetching exams:', error)
      toast.error('Failed to load exams')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/admin/subjects')
      setSubjects(response.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingExam) {
        await api.put(`/api/admin/exams/${editingExam.id}`, formData)
        toast.success('Exam updated successfully')
      } else {
        await api.post('/api/admin/exams', formData)
        toast.success('Exam created successfully')
      }
      
      setShowModal(false)
      setEditingExam(null)
      resetForm()
      fetchExams()
    } catch (error) {
      console.error('Error saving exam:', error)
      toast.error('Failed to save exam')
    }
  }

  const handleEdit = (exam) => {
    setEditingExam(exam)
    setFormData({
      title: exam.title,
      description: exam.description,
      subjectId: exam.subject.id,
      durationMinutes: exam.durationMinutes,
      totalMarks: exam.totalMarks,
      passMarks: exam.passMarks,
      totalQuestions: exam.totalQuestions,
      level: exam.level,
      startTime: exam.startTime,
      endTime: exam.endTime
    })
    setShowModal(true)
  }

  const handleDelete = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return
    
    try {
      await api.delete(`/api/admin/exams/${examId}`)
      toast.success('Exam deleted successfully')
      fetchExams()
    } catch (error) {
      console.error('Error deleting exam:', error)
      toast.error('Failed to delete exam')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subjectId: '',
      durationMinutes: 60,
      totalMarks: 100,
      passMarks: 50,
      totalQuestions: 10,
      level: 'EASY',
      startTime: '',
      endTime: ''
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (exam) => {
    const now = new Date()
    const startTime = new Date(exam.startTime)
    const endTime = new Date(exam.endTime)
    
    if (now < startTime) return 'text-blue-600 bg-blue-100'
    if (now >= startTime && now <= endTime) return 'text-green-600 bg-green-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getStatusText = (exam) => {
    const now = new Date()
    const startTime = new Date(exam.startTime)
    const endTime = new Date(exam.endTime)
    
    if (now < startTime) return 'Upcoming'
    if (now >= startTime && now <= endTime) return 'Active'
    return 'Completed'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="mt-2 text-gray-600">Create and manage examinations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Exam
        </button>
      </div>

      {/* Exams Table */}
      <div className="card">
        {exams.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No exams found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new exam.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                        <div className="text-sm text-gray-500">{exam.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.subject.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.durationMinutes} minutes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam)}`}>
                        {getStatusText(exam)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(exam)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingExam ? 'Edit Exam' : 'Create New Exam'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    className="input"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="form-label">Subject</label>
                  <select
                    required
                    className="input"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      required
                      className="input"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({...formData, durationMinutes: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="form-label">Total Questions</label>
                    <input
                      type="number"
                      required
                      className="input"
                      value={formData.totalQuestions}
                      onChange={(e) => setFormData({...formData, totalQuestions: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Total Marks</label>
                    <input
                      type="number"
                      required
                      className="input"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({...formData, totalMarks: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="form-label">Pass Marks</label>
                    <input
                      type="number"
                      required
                      className="input"
                      value={formData.passMarks}
                      onChange={(e) => setFormData({...formData, passMarks: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Level</label>
                  <select
                    className="input"
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Start Time</label>
                    <input
                      type="datetime-local"
                      required
                      className="input"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label">End Time</label>
                    <input
                      type="datetime-local"
                      required
                      className="input"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingExam(null)
                      resetForm()
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingExam ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminExams
