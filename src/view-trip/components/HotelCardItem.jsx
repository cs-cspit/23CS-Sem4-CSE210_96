import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { useEffect } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';

function HotelCardItem({ hotel }) {
    const[photourl,setphotourl] = useState();
    useEffect(()=>{
      hotel&&GetPlacePhoto()
    },[hotel])
  
    const GetPlacePhoto=async ()=>{
      const data={
        textQuery: hotel?.hotelName
      }
      const result = await GetPlaceDetails(data).then(Resp=>{
        console.log(Resp.data.places[0].photos[3].name)
        const Photourl=PHOTO_REF_URL.replace('{NAME}',Resp.data.places[0].photos[3].name)
        setphotourl(Photourl);        
      })
    }
    
    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotelName + "," + hotel?.hotelAddress} target='_blank'>
            <div className='hover:scale-105 transition-all cursor-pointer mt-2 sm:mt-4'>
                <img src={photourl} className='rounded-xl h-[150px] sm:h-[180px] w-full object-cover'/>
                <div className='my-1 sm:my-2 flex flex-col gap-1 sm:gap-2'>
                    <h2 className='font-medium text-sm sm:text-base line-clamp-1'>{hotel?.hotelName}</h2>
                    <h2 className='text-[10px] sm:text-xs text-gray-500 line-clamp-1'>📍 {hotel?.hotelAddress}</h2>
                    <h2 className='text-xs sm:text-sm'>💰 {hotel?.price}</h2>
                    <h2 className='text-xs sm:text-sm'>⭐ {hotel?.rating}</h2>
                </div>
            </div>
        </Link>
    )
}

export default HotelCardItem