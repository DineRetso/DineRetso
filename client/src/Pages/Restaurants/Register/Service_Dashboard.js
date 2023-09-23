import React from "react";
import { Link } from "react-router-dom";

export default function Service_Dashboard() {
  return (
    <div className='flex font-inter justify-center items-center flex-col py-10 md:px-28 sm:px-16 px-5 lg:px-40 space-y-5'>
      <div className='flex border-b border-md border-main w-full justify-center'>
        <p className='text-6xl'>DineRetso</p>
      </div>
      <div className='flex flex-col justify-center items-center space-y-2'>
        <p className='font-sans font-bold text-2xl'>Connect with us!</p>
        <p class='first-line-indent' className='text-justify'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra
          scelerisque neque, in scelerisque odio fermentum in. Sed vel aliquam
          lectus. Nulla bibendum, quam in consequat hendrerit, dolor risus
          luctus dolor, vel ultrices nunc justo id urna. Vestibulum congue nulla
          id justo elementum, sit amet tincidunt nunc bibendum. Vestibulum vel
          dui eget ex fermentum consequat. Ut quis ligula eget justo gravida
          bibendum in ac lorem. Nullam condimentum bibendum dui, at bibendum
          lorem bibendum a. Sed ut odio eu tellus dapibus interdum in vel quam.
          Fusce dapibus, ex in cursus euismod, urna elit interdum arcu, vel
          sollicitudin justo elit non tortor. Maecenas gravida, lorem nec
          faucibus fermentum, dolor metus tincidunt turpis, eu facilisis neque
          risus id sapien. Nunc euismod aliquet risus, eu tristique ligula
          hendrerit eget. Sed tincidunt mi non ante fringilla feugiat. Etiam nec
          ullamcorper velit. Donec ac aliquet sapien. Cras viverra ligula non
          viverra congue. Curabitur non risus vitae arcu condimentum aliquam.
          Sed a dui ut enim volutpat dictum. Maecenas lacinia euismod odio, vel
          efficitur elit mattis et. Integer ac libero at neque blandit mattis eu
          vel elit.
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
