import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowRight,
  Zap,
  AlertCircle
} from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const { setUser } = useExpenseStore()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Name validation for signup
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Confirm password for signup
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Create user with actual form data
      const user = {
        id: Date.now().toString(),
        name: isLogin ? formData.email.split('@')[0] : formData.name.trim(),
        email: formData.email,
        currency: 'USD',
        monthlyIncome: 0,
        savingsGoal: 0,
        riskTolerance: 'moderate' as const
      }

      setUser(user)
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      
      toast.success(isLogin ? `Welcome back, ${user.name}!` : `Account created successfully! Welcome, ${user.name}!`)
      navigate('/')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    
    try {
      // Simulate social login API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, create a user with provider info
      // In real app, this would come from the OAuth provider
      const user = {
        id: `${provider.toLowerCase()}-${Date.now()}`,
        name: `Demo User`, // In real app, this comes from OAuth
        email: `demo@${provider.toLowerCase()}.com`, // In real app, this comes from OAuth
        currency: 'USD',
        monthlyIncome: 0,
        savingsGoal: 0,
        riskTolerance: 'moderate' as const
      }

      setUser(user)
      toast.success(`Successfully signed in with ${provider}!`)
      navigate('/')
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@expenseai.com',
        currency: 'USD',
        monthlyIncome: 5000,
        savingsGoal: 1000,
        riskTolerance: 'moderate' as const
      }

      setUser(user)
      toast.success('Welcome to the demo!')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ExpenseAI</h1>
          <p className="text-gray-500">Smart expense tracking with AI insights</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Sign in to your account' : 'Start your financial journey today'}
            </p>
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full mb-4 p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Try Demo Account</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="font-medium text-gray-700">Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin('Facebook')}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">f</span>
              </div>
              <span className="font-medium text-gray-700">Continue with Facebook</span>
            </button>

            <button
              onClick={() => handleSocialLogin('LinkedIn')}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
              <span className="font-medium text-gray-700">Continue with LinkedIn</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`input pl-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <div className="flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.email}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.password}</p>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`input pl-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  </div>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setErrors({})
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  })
                }}
                className="text-primary-600 font-medium ml-1 hover:text-primary-700"
                disabled={isLoading}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Terms and Privacy */}
          {!isLogin && (
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <button className="text-primary-600 hover:text-primary-700">Terms of Service</button>
                {' '}and{' '}
                <button className="text-primary-600 hover:text-primary-700">Privacy Policy</button>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}