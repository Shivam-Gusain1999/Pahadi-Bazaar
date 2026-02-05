import React from "react";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Loading = () => {
const {navigate} = useAppContext();
let {search} = useLocation()
const query = new URLSearchParams(search)
const nextUrl = query.get('next')

useEffect(()=>{
    if(nextUrl){
        setTimeout(()=>{
    navigate(`/${nextUrl}`)
}, 5000)
    }

}, [nextUrl])

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="relative">
        {/* Gradient Circle */}
        <div className="h-28 w-28 rounded-full animate-spin bg-gradient-to-tr from-pink-500 via-primary to-blue-500 p-[2px]">
          {/* Inner Circle */}
          <div className="h-full w-full rounded-full bg-white"></div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-tr from-pink-500 via-primary to-primary opacity-60 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loading;
