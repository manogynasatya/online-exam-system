import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [exams, setExams] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [formData, setFormData] = useState({
    questionText: '',
    optionOne: '',
    optionTwo: '',
    optionThree: '',
    optionFour: '',
    correctAnswer: '',
    marks: 1,
    examId: '',
    subjectId: ''
  })

  useEffect(() => {
    fetchQuestions()
    fetchExams()
    fetchSubjects()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/api/admin/questions')
      setQuestions(response.data)
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const fetchExams = async () => {
    try {
      const response = await api.get('/api/admin/exams')
      setExams(response.data)
    } catch (error) {
      console.error('Error fetching exams:', error)
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
      if (editingQuestion) {
        await api.put(`/api/admin/questions/${editingQuestion.id}`, formData)
        toast.success('Question updated successfully')
      } else {
        await api.post('/api/admin/questions', formData)
        toast.success('Question created successfully')
      }
      
      setShowModal(false)
      setEditingQuestion(null)
      resetForm()
      fetchQuestions()
    } catch (error) {
      console.error('Error saving question:', error)
      toast.error('Failed to save question')
    }
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      questionText: question.questionText,
      optionOne: question.optionOne,
      optionTwo: question.optionTwo,
      optionThree: question.optionThree,
      optionFour: question.optionFour,
      correctAnswer: question.correctAnswer,
      marks: question.marks,
      examId: question.exam.id,
      subjectId: question.subject.id
    })
    setShowModal(true)
  }

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return
    
    try {
      await api.delete(`/api/admin/questions/${questionId}`)
      toast.success('Question deleted successfully')
      fetchQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('Failed to delete question')
    }
  }

  const resetForm = () => {
    setFormData({
      questionText: '',
      optionOne: '',
      optionTwo: '',
      optionThree: '',
      optionFour: '',
      correctAnswer: '',
      marks: 1,
      examId: '',
      subjectId: ''
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="mt-2 text-gray-600">Manage exam questions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </button>
      </div>

      {/* Questions Table */}
      <div className="card">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new question.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {question.questionText}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {question.exam.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {question.subject.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {question.marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(question)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
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
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Question Text</label>
                  <textarea
                    required
                    className="input"
                    rows="3"
                    value={formData.questionText}
                    onChange={(e) => setFormData({...formData, questionText: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Option A</label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.optionOne}
                      onChange={(e) => setFormData({...formData, optionOne: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label">Option B</label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.optionTwo}
                      onChange={(e) => setFormData({...formData, optionTwo: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Option C</label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.optionThree}
                      onChange={(e) => setFormData({...formData, optionThree: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label">Option D</label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.optionFour}
                      onChange={(e) => setFormData({...formData, optionFour: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Correct Answer</label>
                  <select
                    required
                    className="input"
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
                  >
                    <option value="">Select Correct Answer</option>
                    <option value={formData.optionOne}>A. {formData.optionOne}</option>
                    <option value={formData.optionTwo}>B. {formData.optionTwo}</option>
                    <option value={formData.optionThree}>C. {formData.optionThree}</option>
                    <option value={formData.optionFour}>D. {formData.optionFour}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Marks</label>
                    <input
                      type="number"
                      required
                      className="input"
                      value={formData.marks}
                      onChange={(e) => setFormData({...formData, marks: parseInt(e.target.value)})}
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
                </div>

                <div>
                  <label className="form-label">Exam</label>
                  <select
                    required
                    className="input"
                    value={formData.examId}
                    onChange={(e) => setFormData({...formData, examId: e.target.value})}
                  >
                    <option value="">Select Exam</option>
                    {exams.map(exam => (
                      <option key={exam.id} value={exam.id}>{exam.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingQuestion(null)
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
                    {editingQuestion ? 'Update' : 'Create'}
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

export default AdminQuestions
