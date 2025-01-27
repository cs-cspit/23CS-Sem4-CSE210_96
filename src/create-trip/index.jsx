import React, { useEffect } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { AI_PROMPT, SelectBudgetOptions } from '@/constants/options';
import { SelectTravelesList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/service/FirebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [place, setPlace] = useState();
  const [FormData, setFormData] = useState([]);
  const [openDialog, setopenDialog] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const [loading,setloading] = useState(false);
  const navigate=useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...FormData,
      [name]: value
    })
  }

  useEffect(() => {
    console.log(FormData);

  }, [FormData])

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log("Login success, response:", response);
      GetUserProfile(response);
    },
    onError: (error) => console.error("Login failed:", error),
  });

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');

    if (!user) {
      setopenDialog(true);
      return;
    }

    if (FormData?.noOfDays > 5 && !FormData?.location || !FormData?.budget || !FormData?.traveler) {
      toast("Please fill all details.")
      return;
    }
    setloading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', FormData?.location?.label)
      .replace('{totalDays}', FormData?.noOfDays)
      .replace('{traveler}', FormData?.traveler)
      .replace('{budget}', FormData?.budget)
      .replace('{totalDays}', FormData?.noOfDays)

    // console.log(FINAL_PROMPT);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());
    setloading(false);
    SaveAiTrip(result?.response?.text());
  }

  const SaveAiTrip=async(TripData)=>{
    setloading(true);
    const user= JSON.parse(localStorage.getItem('user'));
    const docId=Date.now().toString()
    await setDoc(doc(db, "AITrips", docId), {
      userSelection:FormData,
      tripData:JSON.parse(TripData),
      userEmail:user?.email,
      id:docId
    });
    setloading(false);
    navigate('/view-trip/'+docId)
  }

// to check user's authentication in JSON format
  const GetUserProfile = (tokenInfo) => {
    if (!tokenInfo?.access_token) {
      console.error("Access token is missing or invalid.");
      return;
    }
  
    axios.get(`https://openidconnect.googleapis.com/v1/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokenInfo.access_token}`,
        Accept: 'application/json',
      }
    })
    .then((resp) => {
      console.log("User profile fetched successfully:", resp.data);
      // Uncomment the lines below after verifying successful response
      localStorage.setItem('user', JSON.stringify(resp.data));
      setopenDialog(false);
      onGenerateTrip();
    })
    .catch((err) => {
      console.error("Error fetching user profile:", err?.response?.data || err.message);
    });
  };
  
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 w-8/12 mx-auto'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => { setPlace(v); handleInputChange('location', v) }
            }}
          />
        </div>
        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <Input placeholder={'Ex-3'} type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
      </div>
      <div>
        <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div key={index}
              onClick={() => handleInputChange('budget', item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
          ${FormData?.budget == item.title && 'shadow-lg border-black'}
          `}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>Who do you plan on travelling with on your next adventure?</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
          {SelectTravelesList.map((item, index) => (
            <div key={index}
              onClick={() => handleInputChange('traveler', item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
          ${FormData?.traveler == item.people && 'shadow-lg border-black'}
          `}>
              {/* for dynamic styling we use curly braces in class */}
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className='my-10 justify-end flex'>
        <Button 
        disabled={loading}
        onClick={onGenerateTrip}>
        {loading?
        <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin'/>:  'Generate Trip'
        }
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setopenDialog}>  
        <DialogContent>
          <DialogHeader>
          {/* <DialogTitle>Google Account Sign In</DialogTitle> */}
            <DialogDescription>
              <img src="/Logo.png"/>
              <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
              <p>Sign in to the App with Google Authentication Securely</p>

              <Button
              onClick={login}
              className='w-full mt-5 flex items-center gap-4'>   
              <FcGoogle className='h-7 w-7'/>
              Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default CreateTrip
