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
    // Function to handle scroll event
    const handleScroll = () => {
      // Check if the user has scrolled up
      setIsScrolledUp(window.scrollY > 0);
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the listener when the component unmounts
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
  const navClass = isScrolledUp ? "scrolled" : "";

  return (
    <nav
      className={`sticky top-0 z-50 w-full text-BlackColor py-1 text-xl font-inter ${navClass}`}
    >
      <div className='mx-auto px-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <a href='/' className=''>
                <div className='flex'>
                  <div className='flex text-neutrals-700 justify-center items-center text-5xl'>
                    <img
                      src='../Logo.png'
                      alt='DineRetso Logo'
                      className='w-24 h-24'
                    />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className='hidden md:flex lg:flex items-center'>
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
            } transition-all duration-500 ease-in-out absolute w-full h-auto top-20 left-0 text-red-500 font-helvetica rounded-lg shadow-lg z-10`}
          >
            <div className='flex flex-col w-full h-full bg-green-700'>
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
