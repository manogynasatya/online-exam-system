import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const StudentDashboard = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    pendingExams: 0
  })

  useEffect(() => {
    fetchAvailableExams()
  }, [])

  const fetchAvailableExams = async () => {
    try {
      const response = await api.get('/api/student/exams/available')
      setExams(response.data)
      
      // Calculate stats
      const now = new Date()
      const completed = response.data.filter(exam => new Date(exam.endTime) < now).length
      const pending = response.data.filter(exam => new Date(exam.startTime) > now).length
      
      setStats({
        totalExams: response.data.length,
        completedExams: completed,
        pendingExams: pending
      })
    } catch (error) {
      console.error('Error fetching exams:', error)
      toast.error('Failed to load exams')
    } finally {
      setLoading(false)
    }
  }

  const getExamStatus = (exam) => {
    const now = new Date()
    const startTime = new Date(exam.startTime)
    const endTime = new Date(exam.endTime)
    
    if (now < startTime) {
      return { status: 'upcoming', color: 'blue', icon: Clock }
    } else if (now >= startTime && now <= endTime) {
      return { status: 'active', color: 'green', icon: CheckCircle }
    } else {
      return { status: 'completed', color: 'gray', icon: AlertCircle }
    }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your exams and view results</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalExams}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedExams}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingExams}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Exams */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Exams</h2>
          <Link
            to="/student/results"
            className="btn btn-secondary"
          >
            View Results
          </Link>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No exams available</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no exams available for you to take.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const examStatus = getExamStatus(exam)
              const StatusIcon = examStatus.icon
              
              return (
                <div key={exam.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${examStatus.color}-100 text-${examStatus.color}-800`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {examStatus.status}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Start: {formatDate(exam.startTime)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      End: {formatDate(exam.endTime)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration: {exam.durationMinutes} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Questions: {exam.totalQuestions}
                    </div>
                  </div>
                  
                  {examStatus.status === 'active' && (
                    <Link
                      to={`/student/exam/${exam.id}`}
                      className="w-full btn btn-primary"
                    >
                      Start Exam
                    </Link>
                  )}
                  
                  {examStatus.status === 'upcoming' && (
                    <button
                      disabled
                      className="w-full btn btn-secondary opacity-50 cursor-not-allowed"
                    >
                      Exam Not Started
                    </button>
                  )}
                  
                  {examStatus.status === 'completed' && (
                    <Link
                      to={`/student/results`}
                      className="w-full btn btn-secondary"
                    >
                      View Results
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
