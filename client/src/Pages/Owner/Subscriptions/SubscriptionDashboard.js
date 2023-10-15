import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../../Store";
import axios from "axios";
import { getError } from "../../../utils";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import PaymentDetails from "./PaymentDetails";
import { toast } from "react-toastify";

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

export default function SubscriptionDashboard() {
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
  const navigate = useNavigate();
  const [paymentTransactions, setPaymentTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

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
  useEffect(() => {
    const getPayments = async () => {
      try {
        const response = await axios.get(
          `/api/owner/payment/${owner.myRestaurant}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (response.status === 200) {
          setPaymentTransactions(response.data);
        } else {
          console.error("Error getting payment transactions");
        }
      } catch (error) {
        console.log(getError(error));
      }
    };
    getPayments();
  }, [owner.myRestaurant, userInfo.token]);

  const sortedPayments = [...paymentTransactions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  const openModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setModalOpen(true);
  };
  const closeModal = (e) => {
    e.preventDefault();
    setModalOpen(false);
  };

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
        { error }
      ) : (
        <div>
          {" "}
          <div className='pb-2 border-b flex flex-col'>
            <h1 className='text-3xl font-bold text-neutrals-500 '>
              Subscription Dashboard
            </h1>
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
                    <div>
                      {" "}
                      <button onClick={createPaymentLink}> Buy new</button>
                    </div>
                  )}
                </div>
              ) : (
                <div>Your are currently subscribed.</div>
              )}
            </div>
          </div>
          <div className='w-full overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-orange-500'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border'>
                    Payment ID
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border'>
                    Start
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border'>
                    End
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {!sortedPayments ? (
                  <tr>
                    <td colSpan='4' className='px-6 py-4 text-sm text-gray-500'>
                      No payment transaction!
                    </td>
                  </tr>
                ) : (
                  sortedPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      onClick={() => openModal(payment._id)}
                      className='hover:cursor-pointer hover:bg-orange-500 hover:bg-opacity-50 transition-all'
                    >
                      <td className='px-6 py-4 text-sm text-gray-900 border'>
                        {payment.linkId}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-900 border'>
                        {formatDate(payment.startDate)}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-900 border'>
                        {formatDate(payment.endDate)}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-900 border'>
                        {payment.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {modalOpen && (
            <PaymentDetails
              closeModal={closeModal}
              userInfo={userInfo}
              selectedPaymentId={selectedPaymentId}
            />
          )}
        </div>
      )}
    </div>
  );
}
