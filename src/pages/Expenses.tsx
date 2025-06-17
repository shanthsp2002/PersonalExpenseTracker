import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter, Search, Calendar, Tag } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseList } from '../components/ExpenseList'
import { ExpenseFilters } from '../components/ExpenseFilters'

export function Expenses() {
  const [showForm, setShowForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [dateRange, setDateRange] = useState('')

  const { expenses } = useExpenseStore()

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || expense.category === selectedCategory
    // Add date filtering logic here
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500">Track and manage your spending</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-primary-100 text-primary-700' : ''}`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Date</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Tag className="w-4 h-4" />
            <span>Category</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ExpenseFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense List */}
      <ExpenseList expenses={filteredExpenses} />

      {/* Add Expense Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ExpenseForm onClose={() => setShowForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}