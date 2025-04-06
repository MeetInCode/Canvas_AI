'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { menuOptions } from '@/lib/constant'
import clsx from 'clsx'
import { Separator } from '@/components/ui/separator'
import { Database, GitBranch, LucideMousePointerClick, Moon, Sun } from 'lucide-react'
import { ModeToggle } from '../globals/mode-toggle'
import { useTheme } from 'next-themes'

type Props = {}

const MenuOptions = (props: Props) => {
  const pathName = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Only render UI after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) return null

  const isLight = theme === 'light'

  return (
    <nav style={{ 
      backgroundColor: isLight ? 'white' : 'black',
      color: isLight ? 'black' : 'white',
      borderRight: isLight ? '1px solid #e5e7eb' : '1px solid #374151'
    }} className="fixed left-0 h-screen flex items-center flex-col gap-6 py-4 px-1 z-[51]">
      <div className="flex items-center justify-center flex-col gap-6">
        <Link
          className="flex font-bold flex-row "
          href="/"
        >
          fuzzie.
        </Link>
        <TooltipProvider>
          {menuOptions.map((menuItem) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        'group h-7 w-7 flex items-center justify-center scale-[1.2] rounded-lg p-[3px] cursor-pointer',
                        {
                          'bg-[#EEE0FF] dark:bg-[#2F006B]':
                            pathName === menuItem.href,
                        }
                      )}
                    >
                      <menuItem.Component
                        selected={pathName === menuItem.href}
                      />
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-white/80 dark:bg-black/10 backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
        
        {/* Custom theme toggle button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {isLight ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        </div>
           </nav>
  )
}

export default MenuOptions
