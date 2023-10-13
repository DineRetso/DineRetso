import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../../Store";
import axios from "axios";
import { getError } from "../../../utils";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, owner: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function PlansAndPricing() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, owner }, dispatch] = useReducer(reducer, {
    loading: true,
    owner: [],
    error: "",
  });

  const [paymentLink, setPaymentLink] = useState("");
  const [resto, setResto] = useState(null);
  const [payments, setPayments] = useState(null);
  const [pstat, setPStat] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/users/get-user/${userInfo._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchUser();
  }, [userInfo._id, userInfo.token]);
  useEffect(() => {
    const checkPaymentStatusAndRedirect = async () => {
      try {
        if (owner.linkId) {
          const response = await fetch(
            `/api/payment/getPaymentLink/${owner.linkId}`,
            {
              method: "GET",
            }
          );
          if (!response.ok) {
            throw new Error("Failed to get payment link details");
          }
          const { responseData, restaurants, payments } = await response.json();
          const plink = responseData.data.attributes.checkout_url;
          if (plink) {
            setPaymentLink(plink);
            setResto(restaurants);
            setPayments(payments);
            setPStat(responseData);
          } else {
            console.log(error);
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };
    checkPaymentStatusAndRedirect();
  }, [owner.linkId, setPaymentLink, setResto, setPayments, setPStat, error]);
  

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-5'>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <div className='pb-2 border-b flex flex-col'>
            <h1 className='text-3xl font-bold text-neutrals-500 '>
              Plans and Pricing
            </h1>
            <p className='font-thin'>
              Manage your account settings and preference
            </p>
            <div className='font-thin flex'>
              {owner.subscriptionStatus === "not subscribed" ? (
                <div>
                  <div>You are not subcribed</div>
                  {owner.linkId &&
                  pstat &&
                  pstat.data.attributes.status === "unpaid" ? (
                    <div>
                      Pending subscription. Continue with this link:{" "}
                      <a
                        href={paymentLink}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        PAYMONGO
                      </a>
                    </div>
                  ) : (
                    <div>Subscribe now</div>
                  )}
                </div>
              ) : owner.subscriptionStatus === "expired" ? (
                <div className='flex flex-row'>
                  <div>Your subscription has expired. </div>
                  {owner.linkId &&
                  pstat &&
                  pstat.data.attributes.status === "unpaid" ? (
                    <div>
                      <p>
                        {" "}
                        See pending subscription. Continue with this link:{" "}
                        <a
                          href={paymentLink}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          PAYMONGO
                        </a>
                      </p>
                    </div>
                  ) : (
                    <div>Subscribe now</div>
                  )}
                </div>
              ) : (
                <div>
                  Your are currently subscribed. See <a href=''>SUBSCRIPTION</a>
                </div>
              )}
            </div>
          </div>
          <div></div>
          <div className='w-full flex justify-center items-center mt-2'>
            {owner.subscriptionStatus === "not subscribed" ? (
              <div className='bg-orange-200 p-3 rounded-full flex justify-center items-center w-40'>
                <button className='w-full'>Subscribe</button>
              </div>
            ) : (
              <div>
                {" "}
                <div className='bg-orange-200 p-3 rounded-full flex justify-center items-center w-40'>
                  <button className='w-full'>See Subscription</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="absolute"></div>
    </div>
  );
}
