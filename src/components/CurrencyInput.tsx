import React, { useState, useEffect } from 'react'
import { getCurrencySymbol, parseCurrencyAmount, formatCurrency } from '../utils/currency'
import { useExpenseStore } from '../store/expenseStore'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  name?: string
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = '0.00',
  className = '',
  disabled = false,
  required = false,
  name
}: CurrencyInputProps) {
  const { user } = useExpenseStore()
  const currency = user?.currency || 'USD'
  const symbol = getCurrencySymbol(currency)
  
  const [displayValue, setDisplayValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value > 0 ? value.toString() : '')
    }
  }, [value, isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    
    const numericValue = parseCurrencyAmount(inputValue, currency)
    onChange(numericValue)
  }

  const handleFocus = () => {
    setIsFocused(true)
    setDisplayValue(value > 0 ? value.toString() : '')
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (value > 0) {
      setDisplayValue(value.toString())
    }
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
        {symbol}
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`input pl-8 ${className}`}
        disabled={disabled}
        required={required}
        name={name}
      />
    </div>
  )
}