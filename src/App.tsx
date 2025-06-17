import React from 'react'
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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