import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem'

function Hotels({trip}) {
  return (
    <div className='px-4 sm:px-0'>
        <h2 className='font-bold text-lg sm:text-xl mt-5'>Hotel Recommendation</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5'>
            {/* iteration through no of days  */}
            {trip?.tripData?.hotels?.map((hotel,index)=>(
                <HotelCardItem hotel={hotel}/>
            ))} 
        </div>
    </div>
  )
}

export default Hotels