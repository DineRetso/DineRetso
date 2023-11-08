import React from "react";

export default function AboutUs() {
  return (
    <div className='w-full'>
      <div className='w-full'>
        <div className='w-full'>
          <div className='w-full space-y-5'>
            <div>
              <img
                src='../AboutUSSS.png'
                alt='DineRetso dashboard'
                className='w-full lg:-mt-32 sm:h-screen h-auto object-cover'
              />
            </div>
          </div>
        </div>

        <div className='py-10 bg-orange-500 flex flex-col justify-center items-center h-auto'>
          <div>
            <h1 className='text-3xl md:text-5xl font-bold text-neutrals-200 mb-10'>
              DineRetso
            </h1>
          </div>
          <div className='flex flex-row w-full justify-center items-center space-x-10'>
            <div className='w-[100%]'>
              <p className='text-justify text-lg md:text-xl text-neutrals-200 px-5 md:px-10 mb-20 sm:px-20 '>
                {" "}
                DineRetso is a cutting-edge digital marketing platform tailored
                specifically for restaurants in Nueva Vizcaya, providing an
                immersive experience for both customers and eateries alike. Our
                user-friendly website empowers diners to explore local
                restaurants, peruse their menus, and share their valuable
                feedback and ratings. DineRetso not only enhances the visibility
                of restaurants but also offers customers insights into each
                eatery's unique charm, history, and culinary offerings,
                fostering a dynamic dining culture that celebrates both local
                flavors and digital convenience.
              </p>
            </div>
          </div>

          <div className='py-9 sm:px-20 px-2 bg-TextColor flex flex-col justify-center items-center h-auto'>
            <div>
              <h1 className='text-3xl md:text-5xl font-bold text-neutrals-500 mb-10'>
                Our Mission
              </h1>
            </div>
            <div className='flex flex-col md:flex-row w-full justify-center items-center md:space-x-10'>
              <div className='w-full md:w-1/2'>
                <p className='text-justify text-lg md:text-xl text-neutrals-500 px-5 md:px-10'>
                  To promote and elevate the dining experience in Nueva Vizcaya
                  by showcasing the diverse culinary offerings of local, famous
                  and unique restaurants and establishing a strong presence for
                  each restaurant in the province, thereby contributing to the
                  growth and recognition of Nueva Vizcaya's restaurant industry.
                </p>
              </div>
              <div className='w-full md:w-1/2 flex justify-center items-center h-48 md:h-400'>
                <img className='' src='/about1.png' alt='about' />
              </div>
            </div>
          </div>

          <div className='py-9 sm:px-20 bg-orange-500 flex flex-col justify-center items-center px-2'>
            <div>
              <h1 className='text-3xl md:text-5xl font-bold text-neutrals-200'>
                Our Vision
              </h1>
            </div>
            <div className='flex flex-col md:flex-row w-full justify-center items-center space-y-4 md:space-y-0 md:space-x-10'>
              <div className='w-full md:w-2/5 flex justify-center items-center h-auto'>
                <img
                  src='/vision.png'
                  alt='vision'
                  className='w-1/2 md:w-2/3'
                />
              </div>
              <div className='w-full md:w-3/5'>
                <p className='text-justify text-lg md:text-xl text-neutrals-200 px-5 md:px-10'>
                  DineRetso envisions becoming the premier platform that
                  celebrates Nueva Vizcaya's vibrant dining scene by elevating
                  local, famous and unique restaurant experiences and fostering
                  a united community of culinary excellence, ultimately
                  propelling Nueva Vizcaya's restaurant industry to newfound
                  heights of recognition and success. This ambitious vision
                  reflects their dedication to showcasing the rich culinary
                  traditions and talents of the region.
                </p>
              </div>
            </div>
          </div>

          <div class='py-9 sm:px-20 px-2 md:py-10 bg-TextColor flex flex-col justify-center items-center h-auto'>
            <div className=''>
              <h1 class='text-3xl md:text-5xl font-bold text-neutrals-500 mb-10'>
                Our Platform
              </h1>
            </div>
            <div class='flex flex-col md:flex-row w-full justify-center items-center space-y-4 md:space-y-0 md:space-x-1'>
              <div class='w-full md:w-1/2'>
                <p class='text-justify text-lg md:text-xl text-neutrals-500 px-5 md:px-10'>
                  Thoughtfully crafted to enhance the dining experience for both
                  customers and restaurant owners, making it easier and more
                  enjoyable to explore and engage with Nueva Vizcaya's diverse
                  culinary scene, while also providing local eateries with a
                  strong online presence to thrive in the digital age.
                </p>
              </div>
              <div class='w-full md:w-1/2 flex justify-center items-center'>
                <img src='/platform.png' alt='platform' class='w-96 md:w-144' />
              </div>
            </div>
          </div>

          <div className='bg-orange-500 py-8 px-2'>
            <div className='container mx-auto flex flex-wrap justify-center space-y-6 sm:space-y-0 sm:space-x-6 md:space-x-12 lg:space-x-16'>
              <div className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
                <h1 className='text-2xl mb-4 text-TextColor'>Dineretso</h1>
                <p className='text-white'>
                  Your Ultimate Destination to Explore, and Savor the Finest
                  Restaurants and Delectable Food Experiences!
                </p>
              </div>

              <div className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
                <h1 className='text-2xl mb-4 text-TextColor'>Social Media</h1>
                <div className='flex items-center'>
                  <a
                    href='https://www.facebook.com/profile.php?id=100091883060081'
                    className='text-white mr-2'
                  >
                    <i className='fab fa-facebook-square text-3xl'></i>
                  </a>
                  <a href='#' className='text-white'>
                    <i className='fab fa-instagram text-3xl'></i>
                  </a>
                </div>
              </div>

              <div className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
                <h1 className='text-2xl mb-4 text-TextColor'>Address</h1>
                <p className='text-white'>
                  Bayombong, Nueva Vizcaya, Philippines
                </p>
                <p className='text-white'>3711</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
