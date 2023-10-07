// {filterOption === "resto" &&
//                     (resRev.length > 0 ? (
//                       resRev.map((review) => (
//                         <div
//                           key={review._id}
//                           className='w-full flex lg:flex-row md:flex-row sm:flex-row flex-col'
//                         >
//                           <div className='lg:w-3/4 md:w-3/4 sm:w-3/4 w-full flex lg:flex-row md:flex-row flex-col border-b'>
//                             <div className='w-auto flex flex-row space-x-2 justify-start items-center border-r'>
//                               <div className='w-14'>
//                                 {review.image ? (
//                                   <div>
//                                     <img
//                                       src={review.image}
//                                       className=' w-10 h-10 rounded-full'
//                                       alt='user-profile'
//                                     />
//                                   </div>
//                                 ) : (
//                                   <div>
//                                     <img
//                                       src='/userIcon.png'
//                                       className=' w-10 h-10 rounded-full'
//                                       alt='user-profile'
//                                     />
//                                   </div>
//                                 )}
//                               </div>
//                               <div className='w-40'>
//                                 <h1>{review.reviewerName}</h1>
//                                 <h1 className='text-sm'>
//                                   {formatDistanceToNow(
//                                     new Date(review.createdAt)
//                                   )}{" "}
//                                   ago
//                                 </h1>
//                                 <Rating
//                                   value={review.rating}
//                                   readOnly
//                                   precision={0.1}
//                                 />
//                               </div>
//                             </div>
//                             <div className='w-full h-full flex flex-col justify-start items-start p-2'>
//                               <div className='mb-2'>
//                                 <h1 className='text-orange-500 font-bold'>
//                                   Source: {review.source}
//                                 </h1>
//                               </div>
//                               <div>
//                                 <h1>{review.comment}</h1>
//                               </div>
//                             </div>
//                           </div>
//                           <div className='lg:w-1/4 md:w-1/4 sm:w-1/4 w-full flex justify-end items-center'>
//                             {review.status === "approved" ? (
//                               <div>
//                                 <h1>Approved</h1>
//                               </div>
//                             ) : (
//                               <div>
//                                 <select className='p-3 w-full h-full rounded-md text-sm border outline-primary-500 shadow-md'>
//                                   <option>Manage</option>
//                                   <option>Approved</option>
//                                   <option>Hide</option>
//                                   <option>Respond</option>
//                                 </select>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div>
//                         <h1>No Reviews Available</h1>
//                       </div>
//                     ))}


// <div>
//   <div className='h-28 w-ful bg-red-200 flex justify-center items-center'>
//     <h1 className='text-5xl font-bold text-TextColor'>
//       Monthly Subscription Benefits
//     </h1>
//   </div>
// </div>
// <div className='flex flex-col w-full p-7 px-20 space-y-8'>
//   <div className='flex justify-start items-center space-x-5'>
//     <i className='material-icons text-red-200 text-5xl'>check_box</i>
//     <p className='text-justify'>
//       <span className='text-red-200 font-semibold'>
//         Menu Managemanent:{" "}
//       </span>
//       <span>
//         The ability to add and edit menus online is a valuable
//         feature. It will allow you to keep your menus up-to-date, add
//         seasonal specials, and make changes quickly, ensuring that
//         customers have accurate information about your offerings.
//       </span>
//     </p>
//   </div>
//   <div className='flex justify-start items-center space-x-5'>
//     <i className='material-icons text-red-200 text-5xl'>check_box</i>
//     <p className='text-justify'>
//       <span className='text-red-200 font-semibold'>
//         Customer Engagement:{" "}
//       </span>
//       <span>
//         Responding to customer feedback is crucial for building a
//         positive reputation and addressing any concerns promptly.
//         DineRetso's platform can help you to manage and engage with
//         customer reviews, which can enhance the overall customer
//         experience.
//       </span>
//     </p>
//   </div>
//   <div className='flex justify-start items-center space-x-5'>
//     <i className='material-icons text-red-200 text-5xl'>check_box</i>
//     <p className='text-justify'>
//       <span className='text-red-200 font-semibold'>
//         Customer Insights:{" "}
//       </span>
//       <span>
//         Access to customer data, ratings, and feedback can provide
//         valuable insights into customer preferences and trends. You
//         can use this information to tailor your offerings and
//         marketing strategies to better serve your target audience.
//       </span>
//     </p>
//   </div>
//   <div className='flex justify-start items-center space-x-5'>
//     <i className='material-icons text-red-200 text-5xl'>check_box</i>
//     <p className='text-justify'>
//       <span className='text-red-200 font-semibold'>
//         Email Marketing:{" "}
//       </span>
//       <span>
//         Email marketing is an effective way to stay in touch with your
//         customer base, inform them about promotions, events, and
//         special offers, and drive repeat business.
//       </span>
//     </p>
//   </div>
//   <div className='flex justify-start items-center space-x-5'>
//     <i className='material-icons text-red-200 text-5xl'>check_box</i>
//     <p className='text-justify'>
//       <span className='text-red-200 font-semibold'>
//         Data Analytics:{" "}
//       </span>
//       <span>
//         You will be able to track and analyze data related to email
//         marketing campaigns, and customer engagements which can help
//         you to make data-driven decisions to refine your marketing
//         strategies and achieve better results.
//       </span>
//     </p>
//   </div>
// </div>


