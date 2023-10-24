import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../../Store";
import axios from "axios";
import { getError } from "../../../utils";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

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
  const [formOpen, setFormOpen] = useState(false);
  const userId = userInfo._id;
  const [payeeName, setPayeeName] = useState("");
  const [payeeResId, setPayeeResId] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const navigate = useNavigate();

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
        setPayeeName(response.data.fName);
        setPayeeResId(response.data.myRestaurant);
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

  const handleFormOpen = (e) => {
    e.preventDefault();
    setFormOpen(true);
  };
  const handleFormClose = (e) => {
    e.preventDefault();
    setFormOpen(false);
  };
  const seeSub = (e) => [
    navigate(
      `/dineretso-restaurant/${owner.myRestaurant}/subscription/dashboard`
    ),
  ];
  const handleBasic = (e) => {
    e.preventDefault();
    setPaymentType("Basic");
  };
  const handlePremium = (e) => {
    e.preventDefault();
    setPaymentType("Premium");
  };

  const createPaymentLink = async () => {
    try {
      if (paymentType === "") {
        return toast.info("Please Select type of service.");
      }
      const response = await fetch(
        "/api/payment/createPaymentLink",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, payeeName, payeeResId, paymentType }),
        },
        {}
      );

      if (!response.ok) {
        throw new Error("Failed to create payment link");
      }
      const data = await response.json();
      window.open(data.data.attributes.checkout_url, "_blank");
      navigate(
        `/dineretso-restaurant/${userInfo.myRestaurant}/subscription/dashboard`
      );
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error("Error creating payment link. Please contact DineRetso.");
    }
  };

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
                  Your are currently subscribed. See{" "}
                  <Link
                    to={`/dineretso-restaurant/${owner.myRestaurant}/subscription/dashboard`}
                  >
                    SUBSCRIPTION
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div></div>
          <div className='w-full flex justify-center items-center mt-2'>
            {!owner.linkId ? (
              <div className='bg-orange-200 p-3 rounded-full flex justify-center items-center w-40'>
                <button className='w-full' onClick={handleFormOpen}>
                  Subscribe
                </button>
              </div>
            ) : (
              <div>
                {" "}
                <div className='bg-orange-200 p-3 rounded-full flex justify-center items-center w-auto'>
                  <button className='w-full' onClick={seeSub}>
                    Subscription Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {formOpen && (
        <div className='fixed lg:left-72 md:left-72 sm:left-72 inset-0 h-screen w-full border bg-neutrals-500 bg-opacity-60'>
          <form>
            <div className='w-1/2 relative'>
              <div className='p-10 grid grid-cols-2 gap-20 w-auto'>
                <div className='bg-TextColor border border-orange-500'>
                  <h1>Price: 200</h1>
                  <p>Image for post</p>
                  <div className='bg-orange-200 p-3 rounded-full flex justify-center items-center w-40'>
                    <p onClick={handleBasic}>Select Service</p>
                  </div>
                </div>
                <div className='bg-TextColor border border-orange-500'>
                  <h1>Price: 500</h1>
                  <p>Can upload image and video</p>
                  <div className='bg-orange-200 p-3 rounded-full flex justify-center items-center w-40'>
                    <p onClick={handlePremium}>Select Service</p>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleFormClose}>Close</button>
            <div className='bg-orange-200 p-3 rounded-full flex justify-center items-center w-40'>
              <button className='w-full' onClick={createPaymentLink}>
                Buy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
