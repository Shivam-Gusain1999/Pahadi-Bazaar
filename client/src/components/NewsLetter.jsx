import React from 'react'

const NewsLetter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
            <h1 className="md:text-4xl text-2xl font-semibold text-gray-800 dark:text-white">Never Miss a Deal!</h1>
            <p className="md:text-lg text-gray-500/70 dark:text-gray-400 pb-8">
                Stay connected with pahadi culture — receive offers, traditions, and new launches in your inbox
            </p>
            <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
                <input
                    className="border border-gray-300 dark:border-gray-600 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500 dark:text-white bg-white dark:bg-gray-800 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Enter your email id"
                    required
                />
                <button type="submit" className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none">
                    Subscribe
                </button>
            </form>
        </div>
    )
}

export default NewsLetter

