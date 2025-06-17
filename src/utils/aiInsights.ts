import { Expense, Budget, AIInsight } from '../store/expenseStore'

export function generateAIInsights(expenses: Expense[], budgets: Budget[]): Omit<AIInsight, 'id'>[] {
  const insights: Omit<AIInsight, 'id'>[] = []
  
  // Analyze spending patterns
  const spendingPatterns = analyzeSpendingPatterns(expenses)
  insights.push(...spendingPatterns)
  
  // Analyze budget alerts
  const budgetAlerts = analyzeBudgetAlerts(expenses, budgets)
  insights.push(...budgetAlerts)
  
  // Find saving opportunities
  const savingOpportunities = findSavingOpportunities(expenses)
  insights.push(...savingOpportunities)
  
  // Generate predictions
  const predictions = generatePredictions(expenses)
  insights.push(...predictions)
  
  return insights
}

function analyzeSpendingPatterns(expenses: Expense[]): Omit<AIInsight, 'id'>[] {
  const insights: Omit<AIInsight, 'id'>[] = []
  
  // Analyze by category
  const categoryTotals = expenses
    .filter(e => e.type === 'expense')
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)
  
  const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)
  
  // Find highest spending category
  const highestCategory = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)[0]
  
  if (highestCategory && totalExpenses > 0) {
    const percentage = (highestCategory[1] / totalExpenses) * 100
    
    if (percentage > 40) {
      insights.push({
        type: 'spending_pattern',
        title: `High ${highestCategory[0]} Spending`,
        description: `${highestCategory[0]} accounts for ${percentage.toFixed(1)}% of your total expenses. Consider reviewing this category for potential savings.`,
        impact: 'high',
        actionable: true,
        date: new Date().toISOString()
      })
    }
  }
  
  // Analyze weekend vs weekday spending
  const weekendExpenses = expenses.filter(e => {
    const date = new Date(e.date)
    const day = date.getDay()
    return (day === 0 || day === 6) && e.type === 'expense'
  })
  
  const weekdayExpenses = expenses.filter(e => {
    const date = new Date(e.date)
    const day = date.getDay()
    return (day >= 1 && day <= 5) && e.type === 'expense'
  })
  
  const weekendTotal = weekendExpenses.reduce((sum, e) => sum + e.amount, 0)
  const weekdayTotal = weekdayExpenses.reduce((sum, e) => sum + e.amount, 0)
  
  if (weekendTotal > weekdayTotal * 0.4) {
    insights.push({
      type: 'spending_pattern',
      title: 'High Weekend Spending',
      description: 'You spend significantly more on weekends. Consider planning weekend activities with a budget in mind.',
      impact: 'medium',
      actionable: true,
      date: new Date().toISOString()
    })
  }
  
  return insights
}

function analyzeBudgetAlerts(expenses: Expense[], budgets: Budget[]): Omit<AIInsight, 'id'>[] {
  const insights: Omit<AIInsight, 'id'>[] = []
  
  budgets.forEach(budget => {
    const spent = expenses
      .filter(e => e.category === budget.category && e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0)
    
    const percentage = (spent / budget.limit) * 100
    
    if (percentage >= 90) {
      insights.push({
        type: 'budget_alert',
        title: `${budget.category} Budget Alert`,
        description: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget. Consider reducing spending in this category.`,
        impact: 'high',
        actionable: true,
        date: new Date().toISOString()
      })
    } else if (percentage >= 75) {
      insights.push({
        type: 'budget_alert',
        title: `${budget.category} Budget Warning`,
        description: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget. Monitor your spending closely.`,
        impact: 'medium',
        actionable: true,
        date: new Date().toISOString()
      })
    }
  })
  
  return insights
}

function findSavingOpportunities(expenses: Expense[]): Omit<AIInsight, 'id'>[] {
  const insights: Omit<AIInsight, 'id'>[] = []
  
  // Analyze recurring small expenses
  const smallExpenses = expenses.filter(e => e.amount < 50 && e.type === 'expense')
  const smallExpenseTotal = smallExpenses.reduce((sum, e) => sum + e.amount, 0)
  
  if (smallExpenses.length > 20 && smallExpenseTotal > 500) {
    insights.push({
      type: 'saving_opportunity',
      title: 'Small Expense Accumulation',
      description: `You have ${smallExpenses.length} small expenses totaling $${smallExpenseTotal.toFixed(2)}. Consider tracking and reducing these micro-expenses.`,
      impact: 'medium',
      actionable: true,
      date: new Date().toISOString()
    })
  }
  
  // Analyze subscription-like patterns
  const subscriptionKeywords = ['subscription', 'monthly', 'netflix', 'spotify', 'gym', 'membership']
  const potentialSubscriptions = expenses.filter(e => 
    subscriptionKeywords.some(keyword => 
      e.description.toLowerCase().includes(keyword)
    ) && e.type === 'expense'
  )
  
  if (potentialSubscriptions.length > 5) {
    const subscriptionTotal = potentialSubscriptions.reduce((sum, e) => sum + e.amount, 0)
    insights.push({
      type: 'saving_opportunity',
      title: 'Subscription Review Opportunity',
      description: `You have ${potentialSubscriptions.length} potential subscriptions costing $${subscriptionTotal.toFixed(2)}. Review and cancel unused subscriptions.`,
      impact: 'high',
      actionable: true,
      date: new Date().toISOString()
    })
  }
  
  return insights
}

function generatePredictions(expenses: Expense[]): Omit<AIInsight, 'id'>[] {
  const insights: Omit<AIInsight, 'id'>[] = []
  
  if (expenses.length < 10) {
    return insights // Need more data for predictions
  }
  
  // Predict monthly spending trend
  const monthlyTotals = expenses
    .filter(e => e.type === 'expense')
    .reduce((acc, expense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7)
      acc[month] = (acc[month] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)
  
  const months = Object.keys(monthlyTotals).sort()
  if (months.length >= 3) {
    const recent = months.slice(-3).map(month => monthlyTotals[month])
    const trend = (recent[2] - recent[0]) / 2
    
    if (trend > 100) {
      insights.push({
        type: 'prediction',
        title: 'Increasing Spending Trend',
        description: `Your monthly spending has increased by $${trend.toFixed(2)} on average. Consider reviewing your budget to maintain financial health.`,
        impact: 'medium',
        actionable: true,
        date: new Date().toISOString()
      })
    } else if (trend < -100) {
      insights.push({
        type: 'prediction',
        title: 'Decreasing Spending Trend',
        description: `Great job! Your monthly spending has decreased by $${Math.abs(trend).toFixed(2)} on average. Keep up the good work!`,
        impact: 'low',
        actionable: false,
        date: new Date().toISOString()
      })
    }
  }
  
  return insights
}