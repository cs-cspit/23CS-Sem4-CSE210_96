import React from 'react'
import { Button } from '../ui/button'

function Header() {
  return (
    <div className='p-3 shadow-sm flex justify-between items-center w-full px-50'>
      <img src='/logo.svg'/>
      <div>
        <Button className='ml-auto'>
          Sign in
        </Button>
      </div>
    </div>
  )
}

export default Header
