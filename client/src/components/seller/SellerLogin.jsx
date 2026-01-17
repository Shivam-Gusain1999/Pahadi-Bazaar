import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = async (event) => {

    try {
      event.preventDefault();
      const { data } = await axios.post("/api/seller/login", { email, password })
      if (data.success) {
        setIsSeller(true)
        navigate("/seller")
      } else {
        toast.error(data.message)
      }


    } catch (error) {
      toast.error("galt h")
    }

  }

  useEffect(() => {

    if (isSeller) {
      navigate("/seller")
    }
  }, [isSeller])


  return !isSeller && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600 dark:text-gray-300'  >

      <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors'>
        <p className='text-2xl font-medium m-auto text-gray-800 dark:text-white'>
          <span className="text-primary">Seller</span> Login
        </p>

        <div className="w-full space-y-1">
          <p>Email</p>
          <input onChange={(e) => { setEmail(e.target.value) }} value={email}
            type="email"
            placeholder="enter you email"
            className="border border-gray-200 dark:border-gray-600 rounded w-full p-2 mt-1 outline-primary bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />
        </div>

        <div className="w-full space-y-1">
          <p>Password</p>

          <input onChange={(e) => { setPassword(e.target.value) }} value={password}
            type="password"
            placeholder="enter your password"
            className="border border-gray-200 dark:border-gray-600 rounded w-full p-2 mt-1 outline-primary bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />
        </div>

        <button
          className="bg-primary hover:bg-primary-dull text-white w-full py-2.5 rounded-md cursor-pointer font-medium transition shadow-md hover:shadow-lg"
        >
          Login
        </button>
      </div>

    </form>
  )
}

export default SellerLogin
