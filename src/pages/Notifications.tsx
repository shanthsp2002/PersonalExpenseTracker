import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, AlertTriangle, CheckCircle, Info, Target, TrendingUp, X, MoreVertical, Trash2, BookMarked as MarkAsRead, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

interface Notification {
  id: string
  type: 'budget_alert' | 'goal_reminder' | 'insight' | 'system'
  title: string
  message: string
  date: string
  read: boolean
  actionable?: boolean
}

export function Notifications() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'budget_alert',
      title: 'Food & Dining Budget Alert',
      message: "You've used 85% of your Food & Dining budget this month. Consider reducing spending in this category.",
      date: new Date().toISOString(),
      read: false,
      actionable: true
    },
    {
      id: '2',
      type: 'goal_reminder',
      title: 'Emergency Fund Goal',
      message: 'You\'re $200 away from reaching your Emergency Fund goal! Keep up the great work.',
      date: new Date(Date.now() - 86400000).toISOString(),
      read: false,
      actionable: true
    },
    {
      id: '3',
      type: 'insight',
      title: 'Weekly Spending Insight',
      message: 'Your spending decreased by 15% this week compared to last week. Great job staying on track!',
      date: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      actionable: false
    },
    {
      id: '4',
      type: 'system',
      title: 'New Feature Available',
      message: 'Check out the new AI-powered expense forecasting in the Smart Planner section.',
      date: new Date(Date.now() - 259200000).toISOString(),
      read: true,
      actionable: false
    },
    {
      id: '5',
      type: 'budget_alert',
      title: 'Transportation Budget Warning',
      message: "You've used 75% of your Transportation budget. Monitor your spending closely.",
      date: new Date(Date.now() - 345600000).toISOString(),
      read: true,
      actionable: true
    }
  ])

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'budget_alert':
        return AlertTriangle
      case 'goal_reminder':
        return Target
      case 'insight':
        return TrendingUp
      case 'system':
        return Info
      default:
        return Bell
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'budget_alert':
        return 'text-danger-600 bg-danger-100'
      case 'goal_reminder':
        return 'text-primary-600 bg-primary-100'
      case 'insight':
        return 'text-success-600 bg-success-100'
      case 'system':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
    setActiveMenu(null)
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
    setActiveMenu(null)
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'budget_alert', label: 'Budget Alerts', count: notifications.filter(n => n.type === 'budget_alert').length },
    { value: 'goal_reminder', label: 'Goals', count: notifications.filter(n => n.type === 'goal_reminder').length },
    { value: 'insight', label: 'Insights', count: notifications.filter(n => n.type === 'insight').length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-primary-600 text-sm font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{option.label}</span>
              {option.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  filter === option.value
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {option.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'unread' ? 'All caught up!' : 'No notifications'}
                </h3>
                <p className="text-gray-500">
                  {filter === 'unread' 
                    ? "You don't have any unread notifications"
                    : "You'll see notifications here when they arrive"
                  }
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => {
                const Icon = getIcon(notification.type)
                const iconColor = getIconColor(notification.type)
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`card hover:shadow-md transition-all duration-200 ${
                      !notification.read ? 'border-l-4 border-l-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`font-semibold truncate ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full ml-2 mt-2 flex-shrink-0" />
                            )}
                          </div>
                          
                          <p className={`text-sm mt-1 ${
                            !notification.read ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {format(new Date(notification.date), 'MMM dd, h:mm a')}
                            </span>
                            
                            {notification.actionable && (
                              <button className="text-primary-600 text-xs font-medium hover:text-primary-700">
                                Take Action
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === notification.id ? null : notification.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        <AnimatePresence>
                          {activeMenu === notification.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                            >
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Mark as read</span>
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-b-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}