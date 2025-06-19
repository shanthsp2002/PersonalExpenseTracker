import { formatCurrency } from '../utils/currency'
import { useExpenseStore } from '../store/expenseStore'

interface AmountDisplayProps {
  amount: number
  className?: string
  showSymbol?: boolean
  showCode?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'default' | 'success' | 'danger' | 'warning' | 'primary'
  prefix?: '+' | '-' | ''
}

export function AmountDisplay({
  amount,
  className = '',
  showSymbol = true,
  showCode = false,
  size = 'md',
  color = 'default',
  prefix = ''
}: AmountDisplayProps) {
  const { user } = useExpenseStore()
  const currency = user?.currency || 'USD'

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const colorClasses = {
    default: 'text-gray-900',
    success: 'text-success-600',
    danger: 'text-danger-600',
    warning: 'text-warning-600',
    primary: 'text-primary-600'
  }

  const formattedAmount = formatCurrency(amount, currency, {
    showSymbol,
    showCode
  })

  return (
    <span className={`font-semibold ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      {prefix}{formattedAmount}
    </span>
  )
}