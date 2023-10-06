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

