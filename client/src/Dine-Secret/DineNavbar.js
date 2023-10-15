import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";

export default function DineNavbar() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const signoutHandler = () => {
    localStorage.removeItem("dineInfo");
    navigate("/login");
  };
  return (
    <div className='flex z-50'>
      <nav className='bg-orange-500 text-TextColor w-72 h-screen fixed top-0 left-0 overflow-y-auto font-inter space-y-10 hidden sm:flex flex-col p-5'>
        <div className='w-full flex flex-col justify-center items-center space-y-3 border-b border-TextColor py-5'>
          <div>
            <h1 className='text-2xl font-bold'>DineRetso</h1>
          </div>
          <div className='rounded-full h-32 w-32 bg-cover bg-neutrals-400'>
            <img
              className='rounded-full h-32 w-32'
              src='/Logo.png'
              alt='logo'
            />
          </div>
        </div>
        <div className='w-full h-auto space-y-1 font-thin text-2xl'>
          <Link
            to='/dine/admin/secret/admin-dashboard'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>dashboard</i>
            <span className='ml-2'>Dashboard</span>
          </Link>
          <Link
            to='/dine/admin/secret/restaurants'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>restaurant</i>
            <span className='ml-2'>Restaurant</span>
          </Link>
          <Link
            to='/dine/admin/secret/registration'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>person_add</i>
            <span className='ml-2'>Registration</span>
          </Link>
          <Link
            to='/dashboard'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>reviews</i>
            <span className='ml-2'>Reviews</span>
          </Link>
          <Link
            to='/dine/admin/secret/customers'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>people</i>
            <span className='ml-2'>Customers</span>
          </Link>
          <Link
            to='/dine/admin/secret/posting'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>article</i>
            <span className='ml-2'>Posts</span>
          </Link>
          <Link
            to='/dashboard'
            className='flex items-center hover:bg-orange-700 p-2'
          >
            <i className='material-icons'>settings</i>
            <span className='ml-2'>Settings</span>
          </Link>
          <div className='flex items-center hover:bg-neutrals-600 p-3'>
            <i className='material-icons'>logout</i>
            <button onClick={signoutHandler} className='ml-2'>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className='bg-orange-500 sm:hidden w-full'>
        <div className='w-full flex flex-row h-20 justify-between items-center'>
          <div className='flex justify-center items-center h-16 w-16'>
            <img src='/Logo.png' alt='logo' className='h-16 w-16' />
          </div>
          <div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='bg-orange-200 text-TextColor p-5  w-full'
            >
              <svg
                className='w-10 h-10'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16m-7 6h7'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${
          isMobileMenuOpen ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500 ease-in-out`}
      >
        {isMobileMenuOpen && (
          <nav className='bg-orange-200 text-TextColor w-full h-screen fixed top-0 left-0 overflow-y-auto font-inter space-y-10 p-7 sm:hidden z-50 '>
            <div className='fixed top-0 w-full'>
              <div className='w-full flex flex-row h-20 justify-between items-center'>
                {" "}
                <div className='flex justify-center items-center h-16 w-16'>
                  <img src='/Logo.png' alt='logo' className='h-16 w-16' />
                </div>
                <div className='pr-8'>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className=' text-TextColor p-5  w-full'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-10 h-10'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className='w-full flex flex-col justify-center items-center space-y-3 border-b border-TextColor py-5 mt-[-40px]'>
              <h1 className='text-2xl font-bold'>DineRetso</h1>
            </div>
            <div className='w-full h-auto space-y-3 font-thin text-2xl'>
              <Link
                to='/dashboard'
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>dashboard</i>
                <span className='ml-2'>Dashboard</span>
              </Link>
              <Link
                to='/dashboard'
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>restaurant</i>
                <span className='ml-2'>Restaurant</span>
              </Link>
              <Link
                to='/dashboard'
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>person_add</i>
                <span className='ml-2'>Registration</span>
              </Link>
              <Link
                to='/dashboard'
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>reviews</i>
                <span className='ml-2'>Reviews</span>
              </Link>
              <Link
                to='/dashboard'
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>people</i>
                <span className='ml-2'>Customers</span>
              </Link>
              <Link
                to='/dashboard'
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>article</i>
                <span className='ml-2'>Blog Post</span>
              </Link>
              <Link
                to='/dashboard'
                className='flex items-center hover:bg-orange-700 p-2'
              >
                <i className='material-icons'>settings</i>
                <span className='ml-2'>Settings</span>
              </Link>
              <div className='flex items-center hover:bg-neutrals-600 p-3'>
                <i className='material-icons'>logout</i>
                <button onClick={signoutHandler} className='ml-2'>
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
