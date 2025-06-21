import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
  type: 'expense' | 'income'
  tags: string[]
  location?: string
  recurring?: boolean
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  aiCategory?: string
  confidence?: number
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'weekly' | 'yearly'
  alerts: boolean
}

export interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'paused'
}

export interface AIInsight {
  id: string
  type: 'spending_pattern' | 'budget_alert' | 'saving_opportunity' | 'prediction'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  actionable: boolean
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  currency: string
  monthlyIncome: number
  savingsGoal: number
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
}

interface ExpenseStore {
  expenses: Expense[]
  budgets: Budget[]
  goals: Goal[]
  insights: AIInsight[]
  user: User | null
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  
  addBudget: (budget: Omit<Budget, 'id'>) => void
  updateBudget: (id: string, budget: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  
  addGoal: (goal: Omit<Goal, 'id'>) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  
  addInsight: (insight: Omit<AIInsight, 'id'>) => void
  clearInsights: () => void
  
  setUser: (user: User | null) => void
  
  // Computed values
  getTotalExpenses: () => number
  getTotalIncome: () => number
  getExpensesByCategory: () => Record<string, number>
  getBudgetStatus: () => { category: string; percentage: number; status: 'good' | 'warning' | 'danger' }[]
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      budgets: [],
      goals: [],
      insights: [],
      user: null, // Start with no user - require login
      
      addExpense: (expense) => {
        const newExpense = {
          ...expense,
          id: Date.now().toString(),
        }
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }))
      },
      
      updateExpense: (id, expense) => {
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...expense } : e
          ),
        }))
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }))
      },
      
      addBudget: (budget) => {
        const newBudget = {
          ...budget,
          id: Date.now().toString(),
        }
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }))
      },
      
      updateBudget: (id, budget) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...budget } : b
          ),
        }))
      },
      
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }))
      },
      
      addGoal: (goal) => {
        const newGoal = {
          ...goal,
          id: Date.now().toString(),
        }
        set((state) => ({
          goals: [...state.goals, newGoal],
        }))
      },
      
      updateGoal: (id, goal) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...goal } : g
          ),
        }))
      },
      
      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }))
      },
      
      addInsight: (insight) => {
        const newInsight = {
          ...insight,
          id: Date.now().toString(),
        }
        set((state) => ({
          insights: [newInsight, ...state.insights],
        }))
      },
      
      clearInsights: () => {
        set({ insights: [] })
      },
      
      setUser: (user) => {
        set({ user })
      },
      
      getTotalExpenses: () => {
        const { expenses } = get()
        return expenses
          .filter((e) => e.type === 'expense')
          .reduce((total, expense) => total + expense.amount, 0)
      },
      
      getTotalIncome: () => {
        const { expenses } = get()
        return expenses
          .filter((e) => e.type === 'income')
          .reduce((total, expense) => total + expense.amount, 0)
      },
      
      getExpensesByCategory: () => {
        const { expenses } = get()
        return expenses
          .filter((e) => e.type === 'expense')
          .reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount
            return acc
          }, {} as Record<string, number>)
      },
      
      getBudgetStatus: () => {
        const { budgets, expenses } = get()
        return budgets.map((budget) => {
          const spent = expenses
            .filter((e) => e.category === budget.category && e.type === 'expense')
            .reduce((total, expense) => total + expense.amount, 0)
          
          const percentage = (spent / budget.limit) * 100
          let status: 'good' | 'warning' | 'danger' = 'good'
          
          if (percentage >= 90) status = 'danger'
          else if (percentage >= 75) status = 'warning'
          
          return {
            category: budget.category,
            percentage,
            status,
          }
        })
      },
    }),
    {
      name: 'expense-store',
    }
  )
)