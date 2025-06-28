import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Expenses } from './pages/Expenses'
import { Budget } from './pages/Budget'
import { Analytics } from './pages/Analytics'
import { Goals } from './pages/Goals'
import { Profile } from './pages/Profile'
import { AIInsights } from './pages/AIInsights'
import { SmartPlanner } from './pages/SmartPlanner'
import { Auth } from './pages/Auth'
import { Settings } from './pages/Settings'
import { Notifications } from './pages/Notifications'
import { useExpenseStore } from './store/expenseStore'

function App() {
  const { user } = useExpenseStore()

  // If no user is logged in, show auth page
  if (!user) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* OAuth callback routes */}
            <Route path="/auth/google/callback" element={<Auth />} />
            <Route path="/auth/facebook/callback" element={<Auth />} />
            <Route path="/auth/linkedin/callback" element={<Auth />} />
            {/* Default auth route */}
            <Route path="*" element={<Auth />} />
          </Routes>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* OAuth callback routes (in case user is already logged in) */}
          <Route path="/auth/google/callback" element={<Auth />} />
          <Route path="/auth/facebook/callback" element={<Auth />} />
          <Route path="/auth/linkedin/callback" element={<Auth />} />
          
          {/* Auth route */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Settings and Notifications (full screen) */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          
          {/* Main app routes with layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/smart-planner" element={<SmartPlanner />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App