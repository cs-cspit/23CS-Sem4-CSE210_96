import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-4 md:mx-16 lg:mx-56 gap-6 md:gap-9'>
      <h1 className='font-extrabold text-2xl md:text-[40px] lg:text-[50px] text-center mt-8 md:mt-16'>
        <p className='text-[#f56551] lg:mb-7'>Discover Your Next Adventure with AI:</p> <p className='lg:mt-4'>Personalised Itineraries at your Fingertips</p>
      </h1>
      <p className='text-sm md:text-lg lg:text-xl text-gray-500 text-center'>
        Your personal trip planner and travel curator,creating custom itineraries tailored to your interests and budget.
      </p>
      <Link to={'/create-trip'}>
      <Button>Get Started,It's Free</Button>
      </Link>
      <img src="/landing_page (1).png" className='bg-transparent mt-[-20px] md:mt-[-35px] w-full max-w-[700px]'/>
    </div>
  )
}

export default Hero
