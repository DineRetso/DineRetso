import React from "react";
import { Link } from "react-router-dom";

export default function Service_Dashboard() {
  return (
    <div className='flex font-inter justify-center items-center flex-col pt-10 space-y-5 bg-neutrals-200'>
      <div className='flex border-b border-md border-main w-full justify-center'>
        <div className='flex flex-col mr-60'>
          <p className='text-6xl font-bold text-orange-200'>Our</p>
          <p className='text-6xl font-bold text-orange-200'>Services</p>
        </div>
        <div className='absolute right-[10%] md:right-[200px] md:-z top-10'>
          <img
            src='../Servicesimg.png'
            alt='DineRetso Services'
            className='h-96 w-auto'
          />
        </div>
      </div>
      <div className='flex flex-col justify-center text-TextColor bg-orange-200 items-center space-y-10 p-24 pb-60'>
        <p className='underline text-4xl'>Connect with Us!</p>
        <p
          class='first-line-indent'
          className='text-justify md:px-28 sm:px-16 px-5 lg:px-40'
        >
          Welcome to DineRetso, your ultimate destination for discovering the
          finest dining experiences in Nueva Vizcaya! At DineRetso, we're all
          about connecting you with the best restaurants in the region, making
          your culinary journey unforgettable. Our user-friendly platform allows
          you to browse through a curated list of restaurants, explore their
          menus, and make informed decisions based on ratings and reviews from
          fellow diners. Whether you're a foodie looking for your next
          gastronomic adventure or a local seeking the perfect spot for any
          occasion, DineRetso has you covered. Join our community today, connect
          with us, and let's savor the flavors of Nueva Vizcaya together!
        </p>
      </div>
      <div className='flex justify-center items-center -translate-y-56'>
        <p className='text-TextColor text-4xl underline'>What we offer?</p>
      </div>
      <div className='w-full flex flex-row space-x-28 justify-center items-center -translate-y-40'>
        <div className='lg:h-60 lg:w-60 md:w-40 md:h-40 w-20 h-20 flex flex-col justify-center items-center bg-TextColor shadow-xl drop-shadow-xl sha rotate-45 rounded-lg'>
          <i className='material-icons'>start</i>
          <h1 class=' -rotate-45'>hello</h1>
        </div>
        <div className='lg:h-60 lg:w-60 md:w-40 md:h-40 w-20 h-20 flex justify-center items-center bg-TextColor shadow-xl drop-shadow-xl rotate-45 rounded-lg'>
          <h1 class=' -rotate-45'>hello</h1>
        </div>
        <div className='lg:h-60 lg:w-60 md:w-40 md:h-40 w-20 h-20 flex justify-center items-center bg-TextColor shadow-xl drop-shadow-xl rotate-45 rounded-lg'>
          <h1 class=' -rotate-45'>hello</h1>
        </div>
      </div>
      <div className='w-full flex flex-row space-x-28 justify-center items-center -translate-y-48'>
        <div className='lg:h-60 lg:w-60 md:w-40 md:h-40 sm:w-20 sm:h-20 flex justify-center items-center bg-TextColor shadow-xl drop-shadow-xl rotate-45 rounded-lg'>
          <h1 class=' -rotate-45'>hello</h1>
        </div>
        <div className='lg:h-60 lg:w-60 md:w-40 md:h-40 sm:w-20 sm:h-20 flex justify-center items-center bg-TextColor shadow-xl drop-shadow-xl  rotate-45 rounded-lg'>
          <h1 class=' -rotate-45'>hello</h1>
        </div>
      </div>
      <div className='flex justify-center items-center -translate-y-24'>
        <div>
          <h1 className='text-orange-500 text-4xl '>Subscription</h1>
        </div>
      </div>
      <div className='bg-orange-200 w-full flex justify-center items-center flex-col text-TextColor py-20 space-y-5'>
        <div>
          <p className='font-semi-bold italic font-sans text-3xl'>
            Let us help you grow your business with our Digital Marketing
            Solution
          </p>
        </div>
        <div className='flex justify-center items-center'>
          <p className='font-sans font-bold text-4xl'>
            Register your business!
          </p>
        </div>
        <div className='flex justify-center items-center'>
          <div className='border bg-TextColor bg-opacity-70 flex justify-center items-center w-60 hover:bg-orange-100 hover:text-orange-500 transition-all duration-300 p-2 rounded-md'>
            <Link to='/register-restaurant'>
              <button class='text-xl font-semibold rounded-full transition duration-300 transform hover:scale-105'>
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
