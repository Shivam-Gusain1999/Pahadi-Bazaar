import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
   <div className='relative'>
  <img src={assets.main_banner_bg} alt="banner" className='w-full hidden sm:block' />
  <img src={assets.main_banner_bg_sm} alt="banner" className='w-full block sm:hidden' />

  <div className='absolute inset-0 flex flex-col items-center sm:items-start justify-end sm:justify-center pb-24 sm:pb-0 px-4 sm:pl-18 lg:pl-24'>
    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-center sm:text-left max-w-72 sm:max-w-80 lg:max-w-105 leading-tight lg:leading-15'>
      Your Smart Choice 🥗, Your Smart Bazaar 🛒
    </h1>

    <div className='flex items-center mt-6 font-medium'>
      <Link
        to={"/products"}
        className='group flex items-center gap-2 px-7 sm:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'
      >
        Shop now
        <img
          className='sm:hidden transition group-focus:translate-x-1'
          src={assets.white_arrow_icon}
          alt="arrow"
        />
      </Link>

      <Link
        to={"/products"}
        className='group hidden sm:flex items-center gap-2 px-9 py-3 cursor-pointer'
      >
        Explore deals
        <img
          className='transition group-hover:translate-x-1'
          src={assets.black_arrow_icon}
          alt="arrow"
        />
      </Link>
    </div>
  </div>
</div>

  )
}

export default MainBanner
