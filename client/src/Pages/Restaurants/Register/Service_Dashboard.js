import React from "react";
import { Link } from "react-router-dom";

export default function Service_Dashboard() {
  return (
    <div className='font-inter pt-10 space-y-5 bg-neutrals-200'>
      <div className='w-full h-[400px] relative'>
        <img
          src='/menuBG4.jpg'
          alt='DineRetso dashboard'
          className='h-full w-full object-cover'
        />
      </div>
      <div className='border-b border-main p-5 md:p-10 flex flex-col md:flex-row'>
        <div className='text-xl w-full md:text-6xl font-bold text-orange-200 justify-center flex item-center'>
          <p>Our Services</p>
        </div>
      </div>
      <div className='text-TextColor bg-orange-200 p-5 md:p-10 lg:p-18 flex flex-col justify-center items-center space-y-5'>
        <p className='text-justify text-xl md:text-2xl lg:text-3xl px-5 md:px-10 lg:px-24 font-bold'>
          Connect with Us!
        </p>
        <p className='text-justify text-lg md:text-xl lg:text-2xl px-5 md:px-10 lg:px-24'>
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
      <div>
        <div className='border-b border-main p-5 md:p-10 flex flex-col md:flex-row'>
          <div className='text-lg w-full md:text-4xl font-bold text-orange-200 justify-center flex item-center'>
            <p>What We Offer?</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10 p-4'>
          <div className='bg-TextColor p-5 md:p-8 shadow-md rounded-lg text-center'>
            <img
              className='w-16 md:w-20 h-16 md:h-20 mx-auto'
              src='/pinpoint.png'
              alt='location'
            />
            <h1 className='text-orange-500 text-lg md:text-xl font-bold mt-3'>
              We give you direction.
            </h1>
            <p className='text-sm md:text-base'>
              DineRetso provides the precise addresses and location of each
              restaurant.
            </p>
          </div>

          <div className='bg-TextColor p-5 md:p-8 shadow-md rounded-lg text-center'>
            <img
              className='w-16 md:w-20 h-16 md:h-20 mx-auto'
              src='/feedback.png'
              alt='feedback'
            />
            <h1 className='text-orange-500 text-lg md:text-xl font-bold mt-3'>
              Feedback and Engagement.
            </h1>
            <p className='text-sm md:text-base'>
              Share your dining experiences, leave reviews, and engage with your
              favorite restaurants.
            </p>
          </div>

          <div className='bg-TextColor p-5 md:p-8 shadow-md rounded-lg text-center'>
            <img
              className='w-16 md:w-20 h-16 md:h-20 mx-auto'
              src='/specials.png'
              alt='specials'
            />
            <h1 className='text-orange-500 text-lg md:text-xl font-bold mt-3'>
              Exclusive Offers and Specials
            </h1>
            <p className='text-sm md:text-base'>
              Enjoy exclusive access to restaurant promotions, discounts, and
              special events.
            </p>
          </div>

          <div className='bg-TextColor p-5 md:p-8 shadow-md rounded-lg text-center'>
            <img
              className='w-16 md:w-20 h-16 md:h-20 mx-auto'
              src='/star.jpg'
              alt='star'
            />
            <h1 className='text-orange-500 text-lg md:text-xl font-bold mt-3'>
              Reviews and Ratings.
            </h1>
            <p className='text-sm md:text-base mb-10'>
              Offer a channel for diners to provide feedback directly to
              restaurants and provide customer support inquiries.
            </p>
          </div>
        </div>
      </div>

      <div className='text-TextColor bg-orange-200 p-5 md:p-10 lg:p-18 flex flex-col justify-center items-center space-y-5'>
        <div className='text-lg w-full md:text-4xl font-bold text-white justify-center flex item-center'>
          <p>Subscription</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2  gap-5 md:gap-10 p-4  item-center'>
          <div className='bg-TextColor p-5 md:p-8 shadow-md rounded-lg text-center'>
            <h1 className='text-orange-500 font-semibold text-3xl mb-3'>
              Basic
            </h1>
            <p className='text-neutrals-500 font-semibold text-6xl'>200</p>
            <p className='text-neutrals-400 text-lg mb-3'>monthly</p>
            <hr class='w-32 md:w-full border-t  border-neutrals-400 mb-3' />
            <ul class='text-neutrals-500'>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>Keep your menus up-to-date</p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>Add and edit menus you want</p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>Manage reviews and feedback.</p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>
                  Track and Analyze data through data analytics
                </p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/xicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>Upload images for your blog post</p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/xicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>
                  Upload promotional videos to boost your restaurant
                </p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/xicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>
                  Show real-time location of your restaurant using Maps{" "}
                </p>
              </li>
            </ul>
          </div>
          <div className='bg-TextColor p-5 md:p-8 shadow-md rounded-lg text-center'>
            <h1 className='text-orange-500 font-semibold text-3xl mb-3'>
              Premium
            </h1>
            <p className='text-neutrals-500 font-semibold text-6xl'>500</p>
            <p className='text-neutrals-400 text-lg mb-3'>monthly</p>
            <hr class='w-32 md:w-full border-t border-neutrals-400 mb-4' />
            <ul class='text-neutrals-500'>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>Keep your menus up-to-date</p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>Add and edit menus you want</p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>Manage reviews and feedback.</p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>
                  Track and Analyze data through data analytics
                </p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>Upload images for your blog post</p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>
                  Upload promotional videos to boost your restaurant
                </p>
              </li>
              <li class='flex items-center mb-2'>
                <img src='/checkicon.png' alt='check' class='h-5 w-5' />
                <p class='ml-2'>
                  Show real-time location of your restaurant using Maps{" "}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='bg-white p-5 md:p-10 lg:p-20 flex flex-col text-TextColor items-center space-y-5'>
        <p className='italic font-sans text-orange-200 text-xl md:text-2xl font-bold text-center'>
          Let us help you grow your business with our Digital Marketing Solution
        </p>
        <p className='font-sans text-2xl text-orange-200 md:text-3xl font-bold text-center'>
          Register your business!
        </p>
        <div className='border bg-orange-200 bg-opacity-70 hover:bg-orange-100 hover:text-orange-500 transition duration-300 p-2 rounded-md'>
          <Link to='/register-restaurant'>
            <button className='text-lg md:text-xl font-semibold rounded-full transition duration-300 transform hover:scale-105'>
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
