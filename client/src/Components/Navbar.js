import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Store } from "../Store";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("resData");
    window.location.href = "/login";
  };

  // Example menu options
  const menuOptions = [
    { text: "Home", link: "/" },
    { text: "Restaurants", link: "/Restaurants" },
    { text: "Menu", link: "/about" },
    { text: "Services", link: "/dineretso-services" },
    { text: "About", link: "/about" },
    ...(userInfo
      ? [
          {
            text: userInfo.fName,
            link: userInfo.isOwner
              ? `/dineretso-restaurant/${userInfo.myRestaurant}/dashboard`
              : `/user/profile/${userInfo._id}`,
            target: userInfo.isOwner ? "_blank" : "",
          },
          { text: "Logout", onClick: signoutHandler, isButton: true },
        ]
      : [{ text: "Login", link: "/login" }]),
  ];

  return (
    <nav className='sticky top-0 z-50 w-full text-red-500 bg-TextColor shadow-md shadow-neutrals-500 bg-opacity-80 py-5 text-xl font-inter'>
      <div className='mx-auto px-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <a href='/' className=''>
                <div className='flex'>
                  <div className='flex text-neutrals-700 justify-center items-center text-5xl'>
                    <p>DineRetso</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className='mr-5 relative'>
            <button onClick={toggleMobileMenu}>
              <FontAwesomeIcon
                icon={faBars}
                className='text-neutrals-700 text-4xl'
              />
            </button>
          </div>
          <div
            className={`${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }  transition-all duration-500 ease-in-out absolute w-full h-auto top-20 left-0 text-red-500 font-helvetica rounded-lg shadow-lg z-10`}
          >
            <div className=' flex flex-col-reverse md:flex-row lg:flex-row w-full h-full bg-green-700'>
              <div className='lg:w-3/4 md:w-3/4 flex justify-center items-center'>
                <div className='p-6'>
                  <p className='text-xl text-neutrals-700'>
                    Welcome to DineRetso! We offer delicious food and
                    exceptional dining experiences. Contact us at:
                  </p>
                  <p className='text-lg text-neutrals-700'>
                    Email: info@dineretso.com
                    <br />
                    Phone: (+63) 977 153 0826
                  </p>
                </div>
              </div>
              <div className='lg:w-1/4 md:w-1/4'>
                <div className='flex flex-col justify-center items-center lg:ml-10 md:text-3xl lg:text-3xl font-bold py-5 space-y-2 md:space-y-5 lg:space-y-10 border-l'>
                  {menuOptions.map((option, index) => (
                    <a
                      key={index}
                      href={option.link}
                      onClick={option.onClick}
                      target={option.target}
                      className={`flex px-4 py-2 hover:bg-hover-text rounded-xl ${
                        option.isButton ? "cursor-pointer" : ""
                      }`}
                    >
                      {option.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
