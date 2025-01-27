import { Button } from '@/components/ui/button'
import React from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useState , useEffect } from 'react';
import { PHOTO_REF_URL } from '@/service/GlobalApi';
import { GetPlaceDetails } from '@/service/GlobalApi';

function PlaceCardItem({place}) {
  const[photourl,setphotourl] = useState();
    useEffect(()=>{
      place&&GetPlacePhoto();
    },[place])
  
    const GetPlacePhoto=async ()=>{
      const data={
        textQuery:place?.placeName
      }
      const result = await GetPlaceDetails(data).then(Resp=>{
        console.log(Resp.data.places[0].photos[3].name)
        const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',Resp.data.places[0].photos[3].name)
        setphotourl(PhotoUrl);
      })
    }

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place?.placeName} target='_blank'>
    <div className='border rounded-xl p-2 sm:p-3 mt-2 flex flex-col sm:flex-row gap-2 sm:gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
        <img src={photourl}
        className='w-full sm:w-[130px] h-[200px] sm:h-[130px] rounded-xl object-cover'
        />
        <div className='flex flex-col gap-2 sm:gap-0'>
            <h2 className='font-bold text-base sm:text-lg line-clamp-1'>{place.placeName}</h2>
            <p className='text-xs sm:text-sm text-gray-400 line-clamp-3 sm:line-clamp-2'>{place.placeDetails}</p>
            <h2 className='mt-1 sm:mt-2 text-sm sm:text-base'> 🕙 {place.travelTime}</h2>
            {/* <Button><FaMapLocationDot /></Button> */}
        </div>
    </div>
    </Link>
  )
}

export default PlaceCardItem