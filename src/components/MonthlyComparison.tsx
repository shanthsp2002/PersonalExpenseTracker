import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useExpenseStore } from '../store/expenseStore'
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns'

export function MonthlyComparison() {
  const { expenses } = useExpenseStore()

  // Generate data for the last 6 months
  const endDate = new Date()
  const startDate = subMonths(endDate, 5)
  const monthRange = eachMonthOfInterval({ start: startDate, end: endDate })

  const data = monthRange.map(month => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)

    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= monthStart && expenseDate <= monthEnd && expense.type === 'expense'
    })

    const monthIncome = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= monthStart && expenseDate <= monthEnd && expense.type === 'income'
    })

    const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalIncome = monthIncome.reduce((sum, expense) => sum + expense.amount, 0)

    return {
      month: format(month, 'MMM yyyy'),
      expenses: totalExpenses,
      income: totalIncome,
      net: totalIncome - totalExpenses
    }
  })

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Bar dataKey="income" fill="#10B981" name="Income" radius={[2, 2, 0, 0]} />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}