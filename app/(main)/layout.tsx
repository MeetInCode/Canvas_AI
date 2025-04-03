import React from 'react'
import Sidebar from '@/app/components/sidebar'
// import InfoBar from '@/components/infobar'

type Props = { children: React.ReactNode }

const Layout = (props: Props) => {
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="w-full ml-[60px]">
        {/* <InfoBar /> */}
        {props.children}
      </div>
    </div>
  )
}

export default Layout
