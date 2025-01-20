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

function CreateTrip() {
  const [place, setPlace] = useState();
  const [FormData, setFormData] = useState([]);
  const [openDialog, setopenDialog] = useState(false);
  const handleInputChange = (name, value) => {
    setFormData({
      ...FormData,
      [name]: value
    })
  }

  useEffect(() => {
    console.log(FormData);

  }, [FormData])
  //google login page code
  const login=useGoogleLogin({
    onSuccess:(codeResp)=>GetUserProfile(codeResp),
    onError:(error)=>console.log(error)
  })

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
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', FormData?.location?.label)
      .replace('{totalDays}', FormData?.noOfDays)
      .replace('{traveler}', FormData?.traveler)
      .replace('{budget}', FormData?.budget)
      .replace('{totalDays}', FormData?.noOfDays)

    console.log(FINAL_PROMPT);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());
  }
// to check user's authentication in JSON format
  const GetUserProfile=(tokenInfo)=>{
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`,{
    headers: {
      Authorization:`Bearer ${tokenInfo?.access_token}`,
      Accept:'Application/json' 
    }}).then((resp)=>{
      console.log(resp);
    })
  }

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
        <div className='grid grid-cols-3 gap-5 mt-5'>
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
        <div className='grid grid-cols-3 gap-5 mt-5'>
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
        <Button onClick={onGenerateTrip}>Generate Trip</Button>
      </div>

      <Dialog open={openDialog}>  
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg"/>
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
