import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useExpenseStore } from '../store/expenseStore'
import { format, subDays, eachDayOfInterval } from 'date-fns'

export function SpendingTrends() {
  const { expenses } = useExpenseStore()

  // Generate data for the last 30 days
  const endDate = new Date()
  const startDate = subDays(endDate, 29)
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  const data = dateRange.map(date => {
    const dayExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.toDateString() === date.toDateString() && expense.type === 'expense'
    })

    const totalExpenses = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    return {
      date: format(date, 'MMM dd'),
      fullDate: date,
      expenses: totalExpenses
    }
  })

  if (data.every(d => d.expenses === 0)) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No spending data for the last 30 days</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Expenses']}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return format(payload[0].payload.fullDate, 'MMMM dd, yyyy')
              }
              return label
            }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}