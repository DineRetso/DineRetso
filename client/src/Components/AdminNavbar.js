import React from "react";

export default function AdminNavbar() {
  return (
    <nav className='p-4'>
      <div className='container flex justify-center items-center'>
        <div className='bg-trans-background p-5 rounded-lg shadow-lg shadow-main'>
          <ul className='flex space-x-4 justify-center'>
            <li className='text-white hover:text-gray-300 transition duration-300'>
              <a href='/admin/manage-restaurants'>Manage Restaurant</a>
            </li>
            <li className='text-white hover:text-gray-300 transition duration-300'>
              <a href='#'>Manage Review</a>
            </li>
            <li className='text-white hover:text-gray-300 transition duration-300'>
              <a href='#'>Manage Menu</a>
            </li>
            <li className='text-white hover:text-gray-300 transition duration-300'>
              <a href='#'>Manage Owner</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
