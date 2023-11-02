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
    fetchUser();
    checkPaymentStatusAndRedirect();
  }, [
    userInfo._id,
    userInfo.token,
    owner.linkId,
    setPaymentLink,
    setResto,
    setPayments,
    setPStat,
    error,
  ]);
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
    <div className='lg:ml-72 md:ml-72 sm:ml-72 font-inter'>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <div className='pb-2 border-b flex flex-col bg-orange-200 p-5 h-60'>
            <h1 className='text-3xl font-bold  '>Plans and Pricing</h1>
            <p className=''>Manage your account settings and preference</p>
            <div className='flex'>
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
          {!owner.linkId ? (
            <div className='flex w-full flex-row justify-evenly -translate-y-20'>
              <div
                className={`${
                  paymentType === "Basic" &&
                  "-translate-y-5 border border-orange-500"
                } border shadow-xl w-72 flex justify-center items-center flex-col bg-TextColor p-2`}
              >
                <div className='flex flex-col justify-center items-center pb-5 border-b w-full'>
                  <h1 className='text-2xl text-orange-500 font-semibold'>
                    Basic
                  </h1>
                  <h2 className='text-xl text-neutrals-500'>200</h2>
                  <h2 className='text-sm text-neutrals-500'>monthly</h2>
                </div>
                <div className='flex flex-col justify-center items-center w-full'>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Keep your menus up-to-date
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Add & edit menus you want
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Manage customer reviews and feedback
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Track and analyze data
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Upload images to you blogpost
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Show realtime location of your map
                    </h1>
                  </div>
                </div>
                <div className='flex justify-center items-center'>
                  {paymentType === "Basic" ? (
                    <div className='w-32 border rounded-xl border-orange-500 bg-orange-500 text-TextColor transition-all p-2'>
                      <button className='text-center w-full'>
                        Selected Plan
                      </button>
                    </div>
                  ) : (
                    <div className='w-32 border rounded-xl border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                      <button
                        className='text-center w-full'
                        onClick={handleBasic}
                      >
                        Select Plan
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`${
                  paymentType === "Premium" &&
                  "-translate-y-5  border border-orange-500"
                } border shadow-xl w-72 flex justify-center items-center flex-col bg-TextColor p-2`}
              >
                <div className='flex flex-col justify-center items-center pb-5 border-b w-full'>
                  <h1 className='text-2xl text-orange-500 font-semibold'>
                    Premium
                  </h1>
                  <h2 className='text-xl text-neutrals-500'>500</h2>
                  <h2 className='text-sm text-neutrals-500'>monthly</h2>
                </div>
                <div className='flex flex-col justify-center items-center w-full'>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Keep your menus up-to-date
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Add & edit menus you want
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Manage customer reviews and feedback
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Track and analyze data
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Upload images to you blogpost
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Show realtime location of your map
                    </h1>
                  </div>
                  <div className='flex justify-start items-center p-2 w-full'>
                    <i className='material-icons text-orange-500'>
                      check_circle
                    </i>
                    <h1 className='text-sm text-neutrals ml-1'>
                      Can upload promotional videos to blog post
                    </h1>
                  </div>
                </div>
                <div className='flex justify-center items-center'>
                  {paymentType === "Premium" ? (
                    <div className='w-32 border rounded-xl border-orange-500 bg-orange-500 text-TextColor transition-all p-2'>
                      <button className='text-center w-full'>
                        Selected Plan
                      </button>
                    </div>
                  ) : (
                    <div className='w-32 border rounded-xl border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
                      <button
                        className='text-center w-full'
                        onClick={handlePremium}
                      >
                        Select Plan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center w-full text-3xl'>
              Subscription Pending
            </div>
          )}
          <div className='w-full flex justify-center items-center'>
            {!owner.linkId ? (
              <div className='bg-orange-200 p-3 rounded-full flex justify-center items-center w-40'>
                <button className='w-full' onClick={createPaymentLink}>
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
    </div>
  );
}
