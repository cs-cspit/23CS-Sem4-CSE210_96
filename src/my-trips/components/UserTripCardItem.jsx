import React, { useState, useEffect } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
    const [photoUrl, setPhotoUrl] = useState(null);

    useEffect(() => {
        if (trip) {
            GetPlacePhoto();
        }
    }, [trip]);

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: trip?.userSelection?.location?.label,
        };
        try {
            const response = await GetPlaceDetails(data);
            const photoUrl = PHOTO_REF_URL.replace(
                '{NAME}',
                response.data.places[0].photos[3]?.name || ''
            );
            setPhotoUrl(photoUrl);
        } catch (error) {
            console.error('Error fetching place photo:', error);
        }
    };

    return (
        <Link to={'/view-trip/'+trip?.id}>
        <div className="object-cover bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-all">
            {photoUrl ? (
                <img
                    src={photoUrl}
                    alt={trip?.userSelection?.location?.label}
                    className="w-full h-[220px] object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    Loading image...
                </div>
            )}
            <div className="p-4">
                <h2 className="font-bold text-lg">{trip?.userSelection?.location?.label}</h2>
                <h2 className="text-sm text-gray-500">
                    {trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} Budget
                </h2>
            </div>
        </div>
        </Link>
    );
}

export default UserTripCardItem;
