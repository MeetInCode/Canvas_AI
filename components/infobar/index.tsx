'use client'
import React, { useEffect, useState } from 'react'
// import { ModeToggle } from '../global/mode-toggle'
import { Book, Headphones } from 'lucide-react'
import Templates from '../icons/cloud_download'
import { Input } from '@/components/ui/input'
import { useTheme } from 'next-themes'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { UserButton } from '@clerk/nextjs'
// import { useBilling } from '@/providers/billing-provider'
// import { onPaymentDetails } from '@/app/(main)/(pages)/billing/_actions/payment-connecetions'

type Props = {}

const InfoBar = (props: Props) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Only render UI after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!mounted) return null

  const isLight = theme === 'light'
  
  // const { credits, tier, setCredits, setTier } = useBilling()

  // const onGetPayment = async () => {
  //   // const response = await onPaymentDetails()
  //   if (response) {
  //     setTier(response.tier!)
  //     setCredits(response.credits!)
  //   }
  // }

  // useEffect(() => {
  //   onGetPayment()
  // }, [])

  return (
    <div 
      className={`flex flex-row justify-end gap-6 items-center px-6 py-3 w-full border-b border-opacity-20 shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md mb-4 ${
        scrolled ? 'backdrop-blur-xl' : 'backdrop-blur-sm'
      }`}
      style={{ 
        backgroundColor: isLight 
          ? scrolled 
            ? 'rgba(255, 255, 255, 0.85)' 
            : 'rgba(255, 255, 255, 0.7)'
          : scrolled 
            ? 'rgba(0, 0, 0, 0.85)' 
            : 'rgba(0, 0, 0, 0.7)',
        color: isLight ? 'black' : 'white',
        borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <span className="flex items-center gap-2 font-medium">
        <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>Credits</p>
        <span className="px-2 py-1 rounded-full text-xs bg-opacity-20" 
          style={{ 
            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
          }}>
          0/10
        </span>
      </span>
      <span className="flex items-center rounded-full bg-opacity-20 px-4 transition-all duration-300 hover:bg-opacity-30"
        style={{ 
          backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
        }}>
        <Input
          placeholder="Quick Search"
          className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </span>
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-full transition-all duration-200 hover:bg-opacity-20 hover:bg-black/5 dark:hover:bg-white/5"
                style={{ 
                  backgroundColor: isLight ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)'
                }}>
                <Headphones className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="backdrop-blur-xl border border-opacity-20"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <p>Contact Support</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-full transition-all duration-200 hover:bg-opacity-20 hover:bg-black/5 dark:hover:bg-white/5"
                style={{ 
                  backgroundColor: isLight ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)'
                }}>
                <Book className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="backdrop-blur-xl border border-opacity-20"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <p>Guide</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
       
      </div>
      <UserButton />
    </div>
  )
}

export default InfoBar
