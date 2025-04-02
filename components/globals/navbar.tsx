import Link from 'next/link'
import React from 'react'
import { MenuIcon } from 'lucide-react'
// import { UserButton, currentUser } from '@clerk/nextjs'

type Props = {}

const Navbar = async (props: Props) => {
//   const user = await currentUser()
  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between">
      <aside className="flex items-center gap-[2px]">
        <p className="text-2xl font-bold">CANVAS</p>
       
        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 animate-pulse">
          AI
        </p>
      </aside>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex items-center gap-4 list-none">
          <li>
            <Link href="#">Products</Link>
          </li>
          <li>
            <Link href="#">Pricing</Link>
          </li>
          <li>
            <Link href="#">Clients</Link>
          </li>
          <li>
            <Link href="#">Resources</Link>
          </li>
          <li>
            <Link href="#">Documentation</Link>
          </li>
          <li>
            <Link href="#">Enterprise</Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="relative inline-flex h-12 animate-glow items-center justify-center rounded-full border border-purple-500/20 bg-black px-6 font-medium text-purple-200 transition-colors hover:bg-purple-950/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          <span className="absolute inset-px rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 blur-md"></span>
          <span className="flex items-center gap-2">
          
            {true ? 'Dashboard' : 'Get Started'}
          </span>
        </Link>
        {
          //pending - wire up user
        }
        {/* {user ? <UserButton afterSignOutUrl="/" /> : null} */}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  )
}

export default Navbar

