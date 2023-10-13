import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../Store";
import { useNavigate } from "react-router-dom";
import SubscriptionDetails from "./SubscriptionDetails";
import { toast } from "react-toastify";

export default function Subscriptions() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [owner, setOwner] = useState(null);
  const navigate = useNavigate();
  const userId = userInfo._id;
  const payeeName = userInfo.fName;
  const payeeResId = userInfo.myRestaurant;
  const [paymentLink, setPaymentLink] = useState("");

  const createPaymentLink = async () => {
    try {
      const response = await fetch(
        "/api/payment/createPaymentLink",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, payeeName, payeeResId }),
        },
        {}
      );

      if (!response.ok) {
        throw new Error("Failed to create payment link");
      }
      const data = await response.json();
      userInfo.linkId = data.data.id;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      window.open(data.data.attributes.checkout_url, "_blank");
      navigate(`/dineretso-restaurant/${userInfo.myRestaurant}/dashboard`);
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error("Error creating payment link. Please contact DineRetso.");
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
        const { responseData, users } = await response.json();
        const paymentsData = responseData;
        const myData = paymentsData.data.attributes.checkout_url;
        console.log("users", users);
        if (paymentsData && myData) {
          setPaymentStatus(paymentsData);
          setPaymentLink(myData);
          setOwner(users);
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
  }, [setPaymentStatus, setPaymentLink, setOwner]);

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 font-inter'>
      {userInfo.subscriptionStatus === "not subscribed" ? (
        <div className='w-full h-full flex flex-col'>
          <div className='w-full h-32 p-5 flex flex-col justify-center items-start  text-neutrals-500 border-b'>
            <h1 className='text-5xl font-bold'>Plans and Pricing</h1>
            <p className='text-xl font-light'>
              Manage your account subscriptions
            </p>
          </div>
          {userInfo.linkId &&
          paymentStatus &&
          paymentStatus.data.attributes.status === "unpaid" ? (
            <div>
              <div>Your Subscription is not yet paid</div>
              <p>
                Please go to this link to continue your payment.
                <a href={paymentLink} target='_blank' rel='noopener noreferrer'>
                  Payment Link
                </a>
              </p>
            </div>
          ) : (
            <div className='w-full flex justify-between px-20 items-center'>
              <div>
                <h1>
                  Enhance your business with DineRetso. Claim all the benefits{" "}
                </h1>
              </div>
              <div className='h-32 max-h-32 flex flex-col justify-center items-center'>
                <h1>Monthly Subscription</h1>
                <div>
                  <form>
                    <div></div>
                  </form>
                </div>
                <div className='w-full flex justify-center items-center p-5'>
                  <div className='w-40 bg-red-200 flex justify-center items-center p-3 rounded-full'>
                    <button
                      className='w-full h-full'
                      onClick={createPaymentLink}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <SubscriptionDetails createPaymentLink={createPaymentLink} />
      )}
    </div>
  );
}
