import { DollarSign, ChevronDown } from 'lucide-react'
import { SUPPORTED_CURRENCIES, getCurrencyByCode } from '../utils/currency'

interface CurrencySelectorProps {
  value: string
  onChange: (currency: string) => void
  className?: string
  showLabel?: boolean
}

export function CurrencySelector({ 
  value, 
  onChange, 
  className = '',
  showLabel = true 
}: CurrencySelectorProps) {
  const selectedCurrency = getCurrencyByCode(value)

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Currency
        </label>
      )}
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pl-10 pr-10 appearance-none cursor-pointer"
        >
          {SUPPORTED_CURRENCIES.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.code} - {currency.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>
      
      {selectedCurrency && (
        <p className="text-xs text-gray-500 mt-1">
          Selected: {selectedCurrency.symbol} {selectedCurrency.name}
        </p>
      )}
    </div>
  )
}