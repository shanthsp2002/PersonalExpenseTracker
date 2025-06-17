import React from 'react'
import { BottomNavigation } from './BottomNavigation'
import { Header } from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16 pb-20 px-4 max-w-md mx-auto">
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
}