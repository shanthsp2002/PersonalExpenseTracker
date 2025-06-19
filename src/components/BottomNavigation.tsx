import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Receipt, 
  PieChart, 
  Brain,
  Calendar
} from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/expenses', icon: Receipt, label: 'Expenses' },
  { path: '/analytics', icon: PieChart, label: 'Analytics' },
  { path: '/ai-insights', icon: Brain, label: 'AI Insights' },
  { path: '/smart-planner', icon: Calendar, label: 'Planner' },
]

export function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-50 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon 
                    className={`w-5 h-5 mb-1 transition-colors ${
                      isActive ? 'text-primary-600' : 'text-gray-400'
                    }`} 
                  />
                  <span 
                    className={`text-xs font-medium transition-colors ${
                      isActive ? 'text-primary-600' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}