import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({trip}) {
  return (
    <div className='px-4 sm:px-0'>
        <h2 className='font-bold text-lg sm:text-xl'>Places to Visit</h2>
        <div>
            {trip?.tripData?.itinerary && Object.entries(trip.tripData.itinerary).map(([key, item],index)=>(
                <div className='mt-3 sm:mt-5' key={index}>
                    <h2 className='font-medium text-base sm:text-lg'>{key}</h2>
                    <h2 className='font-medium text-xs sm:text-sm text-orange-600'>Best Time to Visit: {item.bestTimeToVisit}</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5'>
                    { item.places.map((place, index) => (
                        <div className='my-1 sm:my-2' key={index}>
                            {/* <h2>{place.placeName}</h2> */}
                            <PlaceCardItem place={place}/>
                        </div>
                    ))}
                    </div>
                </div>                
            ))}
        </div>
    </div>
  )
}

export default PlacesToVisit    