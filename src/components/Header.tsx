import { Bell, Search } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { user } = useExpenseStore()
  const navigate = useNavigate()

  // Mock notification count - in a real app this would come from state
  const notificationCount = 2

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">ExpenseAI</h1>
              <p className="text-xs text-gray-500">Welcome back, {user?.name || 'User'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}