import { Bell, Search, User, Settings, LogOut } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function Header() {
  const { user, setUser } = useExpenseStore()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  // Mock notification count - in a real app this would come from state
  const notificationCount = 2

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      setUser(null)
      navigate('/auth')
      toast.success('Signed out successfully!')
    }
    setShowDropdown(false)
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setShowDropdown(false)
  }

  const handleSettingsClick = () => {
    navigate('/settings')
    setShowDropdown(false)
  }

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
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'U'}</span>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors mt-1"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Profile</span>
                    </button>
                    
                    <button
                      onClick={handleSettingsClick}
                      className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 w-full p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  )
}