import React, { useEffect } from 'react'
import { IoIosSend } from "react-icons/io";
import { Button } from '@/components/ui/button';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { useState } from 'react';
import { PHOTO_REF_URL } from '@/service/GlobalApi';
import { RWebShare } from 'react-web-share';
import { useParams } from 'react-router-dom';


//  const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_API_KEY

function InfoSection({ trip }) {
  const [photourl, setphotourl] = useState();
  const { tripId } = useParams();
  useEffect(() => {
    trip && GetPlacePhoto()
  }, [trip])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label
    }
    const result = await GetPlaceDetails(data).then(Resp => {
      console.log(Resp.data.places[0].photos[3].name)
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', Resp.data.places[0].photos[3].name)
      setphotourl(PhotoUrl);
    })
  }

  return (
    <div className='px-4 sm:px-0'>
      <img src={photourl} className='h-[200px] sm:h-[250px] md:h-[340px] w-full object-cover rounded-xl' />
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0'>
        <div className='my-3 sm:my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-xl sm:text-2xl'>
            {trip?.userSelection?.location?.label}
          </h2>
          <div className='flex flex-wrap gap-2 sm:gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-sm'> 📅 {trip.userSelection?.noOfDays} Day</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-sm'> 💰 {trip.userSelection?.budget} Budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-sm'> 🥂  No. of Traveler: {trip.userSelection?.traveler}</h2>
          </div>
        </div>
        <div className='self-center sm:self-auto'>
        {navigator.share ? (
          <RWebShare
            data={{
              text: "Check out my website, AI trip planner!",
              url: `https://ai-trip-planner-web-orcin.vercel.app/view-trip/${tripId}`,
              title: "AI Trip Planner"
            }}
            onClick={() => console.log("Shared Successfully")}
          >
            <Button><IoIosSend /></Button>
          </RWebShare>
        ) : (
          <Button onClick={() => alert("Sharing is not supported on this device.")}>
            <IoIosSend />
          </Button>
        )}
        </div>
      </div>
    </div>
  )
}

export default InfoSection