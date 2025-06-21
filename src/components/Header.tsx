import { Bell, Search, User, Settings } from 'lucide-react'
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

            {/* Profile/Settings Menu */}
            <div className="relative group">
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'U'}</span>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Profile</span>
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}