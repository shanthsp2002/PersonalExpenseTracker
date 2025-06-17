import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useExpenseStore } from '../store/expenseStore'

export function CategoryBreakdown() {
  const { getExpensesByCategory } = useExpenseStore()
  const expensesByCategory = getExpensesByCategory()

  const data = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category: category.length > 10 ? category.substring(0, 10) + '...' : category,
    amount,
    fullCategory: category
  }))

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No expense data available</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name, props) => [
              `$${value.toLocaleString()}`, 
              props.payload.fullCategory
            ]}
          />
          <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}