import React from "react";
import { Link } from "react-router-dom";

export default function Service_Dashboard() {
  return (
    <div className='flex font-inter justify-center items-center flex-col py-10  space-y-5'>
      <div className='flex border-b border-md border-main w-full justify-center'>
        <div className='flex flex-col mr-60'>
          <p className='text-6xl font-bold text-orange-200'>Our</p>
          <p className='text-6xl font-bold text-orange-200'>Services</p>
        </div>
        <div className='absolute right-[200px] top-10'>
          <img
            src='../Servicesimg.png'
            alt='DineRetso Services'
            className='h-96 w-auto'
          />
        </div>
      </div>
      <div className='flex flex-col justify-center text-TextColor bg-orange-200 items-center space-y-10 p-24 pb-60'>
        <p className='font-sans underline text-4xl'>Connect with Us!</p>
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
      <div className='flex justify-center items-center'>
        <p className='font-sans font-bold text-2xl'>What we offer?</p>
      </div>
      <div>
        <p className='font-semi-bold italic font-sans'>
          Let us help you grow your business with our Digital Marketing Solution
        </p>
      </div>
      <div className='flex justify-center items-center'>
        <p className='font-sans font-bold text-2xl'>Register your business!</p>
      </div>
      <div className='flex justify-center items-center'>
        <div className='border border-primary-500 flex justify-center items-center w-full hover:bg-primary-500 text-primary-500 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
          <Link to='/register-restaurant'>
            <button class='text-white font-semibold rounded-full transition duration-300 transform hover:scale-105'>
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
