export interface Currency {
  code: string
  symbol: string
  name: string
  locale: string
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'en-EU' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', locale: 'es-MX' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'en-HK' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'no-NO' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', locale: 'pl-PL' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' }
]

export function getCurrencyByCode(code: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find(currency => currency.code === code)
}

export function formatCurrency(
  amount: number, 
  currencyCode: string = 'USD',
  options: {
    showSymbol?: boolean
    showCode?: boolean
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  } = {}
): string {
  const currency = getCurrencyByCode(currencyCode)
  if (!currency) {
    return amount.toLocaleString()
  }

  const {
    showSymbol = true,
    showCode = false,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options

  try {
    const formatted = new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(amount)

    if (!showSymbol && !showCode) {
      // Return just the number without currency symbol
      return new Intl.NumberFormat(currency.locale, {
        minimumFractionDigits,
        maximumFractionDigits
      }).format(amount)
    }

    if (showCode && !showSymbol) {
      // Replace symbol with code
      return formatted.replace(currency.symbol, currency.code)
    }

    if (showCode && showSymbol) {
      // Add code after the formatted amount
      return `${formatted} ${currency.code}`
    }

    return formatted
  } catch (error) {
    // Fallback formatting
    const symbol = showSymbol ? currency.symbol : ''
    const code = showCode ? ` ${currency.code}` : ''
    return `${symbol}${amount.toLocaleString()}${code}`
  }
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode)
  return currency?.symbol || '$'
}

export function parseCurrencyAmount(value: string, currencyCode: string = 'USD'): number {
  const currency = getCurrencyByCode(currencyCode)
  if (!currency) return 0

  // Remove currency symbols and non-numeric characters except decimal point
  const cleanValue = value
    .replace(new RegExp(`[${currency.symbol}]`, 'g'), '')
    .replace(/[^\d.-]/g, '')
  
  return parseFloat(cleanValue) || 0
}