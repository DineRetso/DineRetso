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
    window.location.href = "/login";
  };

  // Example menu options
  const menuOptions = [
    { text: "Home", link: "/" },
    { text: "Restaurants", link: "/about" },
    { text: "Menu", link: "/about" },
    { text: "Services", link: "/about" },
    { text: "About", link: "/about" },
    ...(userInfo
      ? [
          { text: userInfo.fName, link: "/profile" },
          { text: "Logout", onClick: signoutHandler, isButton: true },
        ]
      : [{ text: "Login", link: "/login" }]),
  ];

  return (
    <nav className='bg-main w-full text-TextColor opacity-90 text-xl font-semibold font-italiana'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <a href='/' className=''>
                <img
                  src='../dlogo.png'
                  alt='DineLogo'
                  className='h-20 w-auto'
                />
              </a>
            </div>
          </div>
          <div className='md:hidden'>
            <button onClick={toggleMobileMenu}>
              <FontAwesomeIcon
                icon={faBars}
                className='text-cyan-950 text-xl'
              />
            </button>
            {isMobileMenuOpen && (
              <div className='absolute top-12 right-4 bg-white border border-cyan-950 rounded-lg shadow-lg z-10'>
                <div className='py-2'>
                  {menuOptions.map((option, index) => (
                    <a
                      key={index}
                      href={option.link}
                      onClick={option.onClick}
                      className={`block px-4 py-2 hover:bg-green ${
                        option.isButton ? "cursor-pointer" : ""
                      }`}
                    >
                      {option.text}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className='hidden md:block'>
            <div className='ml-10 space-x-4 text-cyan-950 font-sans'>
              {menuOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.link}
                  onClick={option.onClick}
                  className={`hover:underline, ${
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
      <hr />
    </nav>
  );
};

export default Navbar;
