import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({trip}) {
  return (
    <div>
        <h2 className='font-bold text-lg'>Places to Visit</h2>
        <div>
            {trip?.tripData?.itinerary && Object.entries(trip.tripData.itinerary).map(([key, item],index)=>(
                <div className='mt-5' key={index}>
                    <h2 className='font-medium text-lg'>{key}</h2>
                    <h2 className='font-medium text-sm text-orange-600'>Best Time to Visit: {item.bestTimeToVisit}</h2>
                    <div className='grid md:grid-cols-2 gap-5'>
                    { item.places.map((place, index) => (
                        <div className='my-2'>
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