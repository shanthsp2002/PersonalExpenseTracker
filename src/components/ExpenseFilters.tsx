import { X } from 'lucide-react'

interface ExpenseFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  dateRange: string
  onDateRangeChange: (range: string) => void
}

export function ExpenseFilters({
  selectedCategory,
  onCategoryChange,
  dateRange,
  onDateRangeChange
}: ExpenseFiltersProps) {
  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Groceries',
    'Other'
  ]

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ]

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-gray-900">Filters</h3>
      
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="input"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="input"
        >
          <option value="">All Time</option>
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {(selectedCategory || dateRange) && (
        <button
          onClick={() => {
            onCategoryChange('')
            onDateRangeChange('')
          }}
          className="flex items-center space-x-2 text-primary-600 text-sm font-medium"
        >
          <X className="w-4 h-4" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  )
}