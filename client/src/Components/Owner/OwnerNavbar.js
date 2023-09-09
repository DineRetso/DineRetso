import React from "react";
import { Link } from "react-router-dom";

export default function OwnerNavbar(props) {
  const { user } = props;
  return (
    <nav className='p-4'>
      <div className='container flex justify-center items-center'>
        <div className='bg-trans-background p-5 rounded-lg shadow-lg shadow-main'>
          <ul className='flex space-x-4 justify-center'>
            <li className='text-white hover:text-gray-300 transition duration-300'>
              <Link
                to={`/dineretso-restaurants/${user.fName}/${user.myRestaurant}`}
              >
                My Restaurant
              </Link>
            </li>

            <li className='text-white hover:text-gray-300 transition duration-300'>
              <a href='#'>Manage Restaurant Menu</a>
            </li>
            <li className='text-white hover:text-gray-300 transition duration-300'>
              <a href='#'>Manage Restaurant Review</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
