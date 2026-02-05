import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import BannerWeather from './BannerWeather'

const MainBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-green-100 to-teal-50">
      {/* Weather Widget */}
      <BannerWeather />
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles - Static for better performance */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-200/30 rounded-full blur-xl"></div>

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 py-10 sm:py-16 lg:py-20">

        {/* Left Content */}
        <div className="flex-1 z-10 text-center md:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-green-700">Fresh from Uttarakhand</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Pahadi
            </span>{' '}
            Bazaar
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 font-medium mb-2">
            Your Smart Choice 🥗
          </p>
          <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-md mx-auto md:mx-0">
            Fresh organic products from the hills of Uttarakhand, delivered to your doorstep
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <Link
              to="/products"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>Shop Now</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-green-400 blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </Link>

            <Link
              to="/products"
              className="group inline-flex items-center gap-2 px-6 py-3 text-green-700 font-semibold hover:text-green-800 transition-colors"
            >
              <span>Explore Deals</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 mt-8 justify-center md:justify-start">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Organic</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4.5a.5.5 0 01.5.5V15a1 1 0 01-1 1h-.05a2.5 2.5 0 00-4.9 0H14V7z" />
              </svg>
              <span>Free Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Content - Images */}
        <div className="flex-1 relative mt-10 md:mt-0 z-10">
          <div className="relative w-full max-w-lg mx-auto">
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative ring - Static for performance */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-green-200"></div>

              {/* Main product image */}
              <img
                src={assets.main_banner_bg}
                alt="Fresh vegetables"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating product cards - Hover animations only */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 hover:scale-105 transition-transform duration-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥬</span>
                <div>
                  <p className="text-xs text-gray-500">Fresh</p>
                  <p className="text-sm font-bold text-green-600">Veggies</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 hover:scale-105 transition-transform duration-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍎</span>
                <div>
                  <p className="text-xs text-gray-500">Organic</p>
                  <p className="text-sm font-bold text-red-500">Fruits</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full px-4 py-2 shadow-lg hover:scale-110 transition-transform duration-200">
              <span className="text-sm font-bold">🔥 50% OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-8 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.17,90.58,127.2,77.45,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
  )
}

export default MainBanner
