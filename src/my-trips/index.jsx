import { db } from '@/service/FirebaseConfig';
import { collection, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom';
import { getDocs , query } from 'firebase/firestore';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
    const navigation = useNavigation();
    const [userTrips,setUsertrips] = useState([]);
    useEffect(() => {
        GetUserTrips();
    }, [])
    // used to get all user trips
    const GetUserTrips = async() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigation('/');
            return;
        }
        
        const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
        const querySnapshot = await getDocs(q);
        // setUsertrips([]);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push(doc.data());
        });
        setUsertrips(trips); // Update state once with all trips
        console.log("Trips fetched:", trips);
    }
    return (
        <div className='px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mt-6 sm:mt-8 md:mt-10'>
            <h2 className='font-bold text-2xl sm:text-3xl md:text-4xl'>
                My trips
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-6 sm:mt-8 md:mt-10'>
                {userTrips?.length>0?userTrips.map((trip,index)=>(
                    <UserTripCardItem trip={trip} key={index} />
                ))
                // skeleton effect
                :[1,2,3,4,5,6].map((item,index)=>( 
                    <div key={index} className='h-[180px] sm:h-[200px] md:h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'>

                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default MyTrips