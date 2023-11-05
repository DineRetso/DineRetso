import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Store } from "../Store";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledUp(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    { text: "Home", link: "/", icon: "home" },
    { text: "Restaurants", link: "/Restaurants", icon: "restaurant" },
    { text: "Menu", link: "/Menus", icon: "room_service" },
    { text: "Services", link: "/dineretso-services", icon: "build" },
    { text: "About", link: "/AboutUs", icon: "info" },
    ...(userInfo
      ? [
          {
            text: "Profile",
            link: userInfo.isOwner
              ? `/dineretso-restaurant/${userInfo.myRestaurant}/dashboard`
              : `/user/profile/${userInfo._id}`,
            target: userInfo.isOwner ? "_blank" : "",
            icon: "person",
          },
          {
            text: "Logout",
            onClick: signoutHandler,
            isButton: true,
            icon: "logout",
          },
        ]
      : [{ text: "Login", link: "/login", icon: "login" }]),
  ];
  const navClass = isScrolledUp ? "scrolled" : "";

  return (
    <nav
      className={`sticky top-0 z-50 w-full text-red-900 py-1 text-xl font-inter ${navClass}`}
    >
      <div className='mx-auto px-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <a href='/' className=''>
                <div className='flex'>
                  <div className='flex justify-center items-center'>
                    <img
                      src='../Logo.png'
                      alt='DineRetso Logo'
                      className='sm:w-20 sm:h-20 w-16 h-16 text-sm'
                    />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className='hidden md:flex lg:flex items-center font-semibold'>
            {menuOptions.map((option, index) => (
              <a
                key={index}
                href={option.link}
                onClick={option.onClick}
                target={option.target}
                className={`${
                  !option.isButton
                    ? "px-4 py-2 hover:bg-hover-text rounded-xl cursor-pointer"
                    : "hidden"
                }`}
              >
                {option.text}
              </a>
            ))}
            {userInfo && (
              <button
                onClick={signoutHandler}
                className='px-4 py-2 hover:bg-hover-text rounded-xl cursor-pointer'
              >
                Logout
              </button>
            )}
          </div>
          <div className='md:hidden lg:hidden mr-5 relative'>
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
            } transition-all duration-500 ease-in-out absolute top-0 left-0 'bg-orange-200 text-TextColor bg-orange-200 w-full h-screen font-inter rounded-lg shadow-lg z-10`}
          >
            <div className='w-full flex flex-row h-16 justify-between items-center bg-orange-500'>
              {" "}
              <div className='flex justify-center items-center h-14 w-14'>
                <img src='/Logo.png' alt='logo' className='h-10 w-10' />
              </div>
              <div className='pr-2'>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className=' text-TextColor p-2  w-full'
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
            <div className='flex flex-col w-full h-full '>
              <div className='flex justify-center items-center p-3 text-2xl font-semibold border-b'>
                <h1>DineRetso</h1>
              </div>
              {menuOptions.map((option, index) => (
                <div
                  key={index}
                  className='p-2 font-thin flex justify-start items-center hover:bg-orange-700 transition-all px-5'
                >
                  <i className='material-icons'>{option.icon}</i>
                  <a
                    href={option.link}
                    onClick={option.onClick}
                    target={option.target}
                    className={`${
                      !option.isButton
                        ? "px-4 py-2 hover:bg-hover-text rounded-xl cursor-pointer w-full"
                        : "hidden"
                    }`}
                  >
                    {option.text}
                  </a>
                </div>
              ))}
              {userInfo && (
                <button
                  onClick={signoutHandler}
                  className='px-4 py-2 hover:bg-hover-text rounded-xl cursor-pointer'
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
