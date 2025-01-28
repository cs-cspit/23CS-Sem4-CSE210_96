import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [openDialog, setopenDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const closeDialog = () => {
    setopenDialog(false);
  };

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log("Login success, response:", response);
      GetUserProfile(response);
    },
    onError: (error) => console.error("Login failed:", error),
  });

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
      window.location.reload();
    })
    .catch((err) => {
      console.error("Error fetching user profile:", err?.response?.data || err.message);
    });
  };

  return (
    <div className='p-3 shadow-sm flex justify-between items-center w-full px-6 md:px-12'>
      <div>
        <a href='/'>
          <img src='/Logo.png' className='border rounded-full w-16 md:w-20  md:ml-8 sm:w-12' />
        </a>
      </div>
      {/* ternary operator */}
      <div>
        {
          user && (
            <div className='flex items-center gap-3 sm:gap-0'>

            <a href='/create-trip'>
            <Button variant="outline" className="rounded-full">+ Create Trip</Button>
            </a>

            <a href='/my-trips'>
            <Button variant="outline" className="rounded-full">My Trips</Button>
            </a>

            <Popover>
              <PopoverTrigger className='bg-white p-0'>
              <img src={user?.picture} className=' rounded-full w-12' />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer rounded-lg' onClick={()=>{
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>LogOut</h2>
              </PopoverContent>
            </Popover>
          </div>
          )
        }
        {!user && (
          <Button onClick={()=>setopenDialog(true)}>Sign in </Button>
        )}
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

export default Header
