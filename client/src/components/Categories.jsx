import React from 'react'
import { useAppContext } from '../context/AppContext'
import { categories } from '../assets/assets'

const Categories = () => {
  const { navigate } = useAppContext()

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium text-gray-800 dark:text-white'>Categories</p>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>

        {categories.map((category, index) => (
          <div
            key={index}
            className="group relative cursor-pointer py-6 px-4 rounded-2xl flex flex-col justify-center items-center
             shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden dark:shadow-gray-700/30"
            style={{
              background: `radial-gradient(circle at top left, ${category.bgColor}, #ffffff)`
            }}

            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            {/* Decorative Glow */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>

            {/* Image */}
            <img
              src={category.image}
              alt={category.text}
              className="group-hover:scale-110 transition-transform duration-300 max-w-24 drop-shadow-lg"
            />

            {/* Text */}
            <p className="mt-3 text-base font-semibold text-gray-800 group-hover:text-primary-dull transition">
              {category.text}
            </p>
          </div>

        ))}

      </div>
    </div>
  );

}

export default Categories

