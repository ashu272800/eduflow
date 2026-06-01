import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Common/Toast';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { ProtectedRoute } from './components/Security/ProtectedRoute';
import { DashboardLayout } from './components/Layout/DashboardLayout';

// Pages
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Unauthorized } from './pages/Auth/Unauthorized';
import { Dashboard } from './pages/Dashboard/Index';
import { StudentList } from './pages/Students/List';
import { CourseList } from './pages/Courses/List';
import { Notifications } from './pages/Notifications/Index';
import { Profile } from './pages/Profile/Index';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected App Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/students"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY', 'STAFF']}>
                      <DashboardLayout>
                        <StudentList />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY', 'STAFF']}>
                      <DashboardLayout>
                        <CourseList />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']}>
                      <DashboardLayout>
                        <Notifications />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Profile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
