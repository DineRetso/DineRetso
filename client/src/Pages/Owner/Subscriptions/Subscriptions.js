import React from "react";

export default function Subscriptions() {
  return (
    <div className='ml-72 font-inter'>
      <div className='w-full h-full flex flex-col'>
        <div className='w-full h-32 p-5 flex flex-col justify-center items-start  text-neutrals-500 border-b'>
          <h1 className='text-5xl font-bold'>Plans and Pricing</h1>
          <p className='text-xl font-light'>
            Manage your account subscriptions
          </p>
        </div>
        <div>
          <div className='h-28 w-ful bg-red-200 flex justify-center items-center'>
            <h1 className='text-5xl font-bold text-TextColor'>
              Monthly Subscription Benefits
            </h1>
          </div>
        </div>
        <div className='flex flex-col w-full p-7 px-20 space-y-8'>
          <div className='flex justify-start items-center space-x-5'>
            <i className='material-icons text-red-200 text-5xl'>check_box</i>
            <p className='text-justify'>
              <span className='text-red-200 font-semibold'>
                Menu Managemanent:{" "}
              </span>
              <span>
                The ability to add and edit menus online is a valuable feature.
                It will allow you to keep your menus up-to-date, add seasonal
                specials, and make changes quickly, ensuring that customers have
                accurate information about your offerings.
              </span>
            </p>
          </div>
          <div className='flex justify-start items-center space-x-5'>
            <i className='material-icons text-red-200 text-5xl'>check_box</i>
            <p className='text-justify'>
              <span className='text-red-200 font-semibold'>
                Customer Engagement:{" "}
              </span>
              <span>
                Responding to customer feedback is crucial for building a
                positive reputation and addressing any concerns promptly.
                DineRetso's platform can help you to manage and engage with
                customer reviews, which can enhance the overall customer
                experience.
              </span>
            </p>
          </div>
          <div className='flex justify-start items-center space-x-5'>
            <i className='material-icons text-red-200 text-5xl'>check_box</i>
            <p className='text-justify'>
              <span className='text-red-200 font-semibold'>
                Customer Insights:{" "}
              </span>
              <span>
                Access to customer data, ratings, and feedback can provide
                valuable insights into customer preferences and trends. You can
                use this information to tailor your offerings and marketing
                strategies to better serve your target audience.
              </span>
            </p>
          </div>
          <div className='flex justify-start items-center space-x-5'>
            <i className='material-icons text-red-200 text-5xl'>check_box</i>
            <p className='text-justify'>
              <span className='text-red-200 font-semibold'>
                Email Marketing:{" "}
              </span>
              <span>
                Email marketing is an effective way to stay in touch with your
                customer base, inform them about promotions, events, and special
                offers, and drive repeat business.
              </span>
            </p>
          </div>
          <div className='flex justify-start items-center space-x-5'>
            <i className='material-icons text-red-200 text-5xl'>check_box</i>
            <p className='text-justify'>
              <span className='text-red-200 font-semibold'>
                Data Analytics:{" "}
              </span>
              <span>
                You will be able to track and analyze data related to email
                marketing campaigns, and customer engagements which can help you
                to make data-driven decisions to refine your marketing
                strategies and achieve better results.
              </span>
            </p>
          </div>
        </div>

        <div className='w-full flex justify-between px-20 items-center'>
          <div>
            <h1>
              Enhance your business with DineRetso. Claim all the benefits{" "}
            </h1>
          </div>
          <div className='h-32 max-h-32 flex flex-col justify-center items-center'>
            <h1>Monthly Subscription</h1>
            <div className='w-full flex justify-center items-center p-5'>
              <div className='w-40 bg-red-200 flex justify-center items-center p-3 rounded-full'>
                <button className='w-full h-full'>Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
