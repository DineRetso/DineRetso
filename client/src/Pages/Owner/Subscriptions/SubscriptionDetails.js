import React, { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import { Store } from "../../../Store";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, paymentTransactions: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SubscriptionDetails(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, paymentTransactions }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      paymentTransactions: [],
      error: "",
    }
  );

  const { createPaymentLink } = props;
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentLink, setPaymentLink] = useState("");

  const handleBuyNewSubscription = async () => {
    try {
      await createPaymentLink(); // Call the function here
    } catch (error) {
      console.error("Error buying new subscription:", error);
      toast.error("Error buying new subscription. Please contact DineRetso.");
    }
  };

  const checkPaymentStatusAndRedirect = async () => {
    try {
      if (userInfo.linkId) {
        const response = await fetch(
          `/api/payment/getPaymentLink/${userInfo.linkId}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to get payment link details");
        }
        const { responseData } = await response.json();
        const paymentsData = responseData;
        const myData = paymentsData.data.attributes.checkout_url;
        if (paymentsData && myData) {
          setPaymentStatus(paymentsData);
          setPaymentLink(myData);
        } else {
          console.log("error");
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast.error(
        "Error checking payment status in subscription. Please contact DineRetso."
      );
    }
  };
  useEffect(() => {
    checkPaymentStatusAndRedirect();
  }, [setPaymentStatus, setPaymentLink]);
  const getPayments = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const response = await axios.get(
        `/api/owner/payment/${userInfo.myRestaurant}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } else {
        dispatch({ type: "FETCH_FAIL", payload: error });
      }
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: error });
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response.data.message,
        });
      } else {
        dispatch({
          type: "FETCH_FAIL",
          payload: "An unexpected error occurred.",
        });
      }
    }
  };
  useEffect(() => {
    checkPaymentStatusAndRedirect();
    getPayments();
  }, [
    userInfo.linkId,
    userInfo.subscriptionStatus,
    userInfo.token,
    userInfo.myRestaurant,
    setPaymentStatus,
  ]);

  const sortedPayments = [...paymentTransactions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "subscribed":
        return "bg-green-700";
      case "not subscribed":
        return "bg-red-500";
      case "expired":
        return "bg-neutrals-500";
      case "pending":
        return "bg-orange-700";
      default:
        return "bg-neutrals-500";
    }
  };

  return (
    <div>
      <div className='w-full '>
        <div className='header w-full flex justify-center items-center bg-'>
          <h1>Payment History</h1>
        </div>
        <div className='w-full p-3'>
          {userInfo.subscriptionStatus === "subscribed" ? (
            <div>You are currently subscribed</div>
          ) : (
            <div>
              {userInfo.linkId &&
              paymentStatus &&
              paymentStatus.data.attributes.status === "unpaid" ? (
                <div>
                  <div>Your subscription is still pending.</div>
                  <p>
                    Please go to this link to continue your payment.
                    <a
                      href={paymentLink}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Payment Link
                    </a>
                  </p>
                </div>
              ) : (
                <div>
                  <div>Your previous subscription has expired</div>
                  <button onClick={handleBuyNewSubscription}>Buy New</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className='w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 p-5'>
          {sortedPayments.map((payment) => (
            <div
              key={payment._id}
              className={`w-full flex flex-col h-auto p-3 rounded-lg shadow-lg ${getStatusColor(
                payment.status
              )}`}
            >
              <div className='flex justify-center items-center capitalize'>
                {payment.status === "subscribed" ? (
                  <div>Current Subscription</div>
                ) : (
                  <div>{payment.status}</div>
                )}
              </div>
              <div className='text-sm'>
                <div>Start Date: {formatDate(payment.startDate)}</div>
                <div>End Date: {formatDate(payment.endDate)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
