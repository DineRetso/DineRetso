import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ViewCustomers({ closeModal, customerData }) {
  const [reviewData, setReviewData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `/api/owner/reviews/${customerData._id}`
        );

        if (response) {
          setReviewData(response.data);
        } else {
          setError("Error fetching Review");
        }
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };
    fetchReview();
  }, [customerData._id]);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
      <div className='flex flex-col w-full md:w-[500px] lg:w-[600px] bg-neutrals-200 p-5 shadow-lg rounded-md'>
        <div className='mb-4'>
          <h1 className='font-semibold mb-2'>
            Name:{" "}
            <span>
              {customerData.fName} {customerData.lName}
            </span>
          </h1>
          <h1 className='font-semibold mb-2'>
            Address: <span>{customerData.address}</span>
          </h1>
          <h1 className='font-semibold mb-2'>
            Phone No: <span>{customerData.mobileNo}</span>
          </h1>
        </div>
        <div className='review-content w-full max-h-60 overflow-y-auto'>
          <div className='overflow-y-auto'>
            {reviewData.length === 0 ? (
              <div>
                <h1>No reviews submitted.</h1>
              </div>
            ) : (
              reviewData.map((review) => (
                <div
                  key={review._id}
                  className='w-full p-2 flex flex-col bg-neutrals-500'
                >
                  <div className='flex flex-row'>
                    <h2>
                      Date: <span>{formatDate(review.createdAt)}</span>
                    </h2>
                    <p>{review.rating} star</p>
                  </div>
                  <div>{review.comment}</div>
                  <div>{review.status}</div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-red-900 font-semibold py-2 px-4 rounded-full'
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
