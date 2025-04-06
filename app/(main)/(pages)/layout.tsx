import React from 'react'
import { cn } from '@/lib/utils'

type Props = { 
  children: React.ReactNode 
}

const Layout = ({ children }: Props) => {
  return (
    <div 
      className={cn(
        "h-screen w-full max-w-full",
        "px-4 py-6 md:px-6 lg:px-8",
        "overflow-y-auto scrollbar-thin",
        "bg-background",
        "transition-all duration-300 ease-in-out",
        "border-muted-foreground/20"
      )}
    >
      <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-300">
        {children}
      </div>
    </div>
  )
}

export default Layout
