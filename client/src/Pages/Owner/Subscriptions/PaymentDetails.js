import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { getError } from "../../../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, payment: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function PaymentDetails({
  closeModal,
  userInfo,
  selectedPaymentId,
}) {
  const [{ loading, error, payment }, dispatch] = useReducer(reducer, {
    loading: true,
    payment: [],
    error: "",
  });

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/owner/getPaymentDetails/${selectedPaymentId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        } else {
          dispatch({ type: "FETCH_FAIL", payload: getError(response) });
        }
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchPayment();
  }, [userInfo.token, selectedPaymentId]);

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
      <div className='relative w-auto max-w-3xl mx-auto my-6'>
        {/* Modal content */}
        <div className='modal-content border-0 rounded-lg shadow-lg'>
          {/* Header */}
          <div className='flex flex-row justify-between space-x-4 p-4 border-b border-gray-300 items-center'>
            <h3 className='text-lg font-semibold'>Payment Details</h3>
            <button
              className=' text-red-900 bg-primary-700 p-2'
              onClick={closeModal}
            >
              &#215;
            </button>
          </div>

          <div className='modal-body p-4'>
            <h1>Payee Name: {payment.payeeName}</h1>
          </div>
          {/* Footer (optional) */}
          <div className='modal-footer p-4 border-t border-gray-300'></div>
        </div>
      </div>
    </div>
  );
}
