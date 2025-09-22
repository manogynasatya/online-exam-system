
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'
import Layout from './Components/Layout'

// Pages
import Home from './pages/Home'
import StudentLogin from './pages/StudentLogin'
import StudentSignup from './pages/StudentSignup'
import StudentDashboard from './pages/StudentDashboard'
import ExamPage from './pages/ExamPage'
import ResultsPage from './pages/ResultsPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminExams from './pages/AdminExams'
import AdminQuestions from './pages/AdminQuestions'
import AdminResults from './pages/AdminResults'
import AdminUsers from './pages/AdminUsers'
import AdminSubjects from './pages/AdminSubjects'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Student Protected Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/exam/:examId" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <Layout>
                <ExamPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/results" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <Layout>
                <ResultsPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/exams" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <AdminExams />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/questions" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <AdminQuestions />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/results" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <AdminResults />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <AdminUsers />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/subjects" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <AdminSubjects />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App