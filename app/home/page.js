'use client'
import dynamic from 'next/dynamic'
 
// Server Component:
// const Home_list = dynamic(() => import('@/components/home_list'))
const Home_list = dynamic(() => import('@/components/home_list'), { ssr: false })
import React from 'react'

const page = () => {
  return (
    <div>
      <Home_list/>
    </div>
  )
}

export default page
