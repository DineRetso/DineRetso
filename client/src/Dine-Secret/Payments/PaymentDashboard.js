import React, { useEffect, useState } from "react";
import { getError } from "../../utils";
import axios from "axios";
import LoadingSpinner from "../../Components/LoadingSpinner";
import PaymentDetails from "./PaymentDetails";

export default function PaymentDashboard() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get("/api/admin/getPayments", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });
        if (response.status === 200) {
          setPaymentData(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
        setLoading(false);
      }
    };
    fetchPayment();
  }, [dineInfo.token]);

  const filteredPayments = paymentData.filter((payment) => {
    const searchLower = searchQuery.toLowerCase();
    const formattedDate = formatDate(payment.createdAt).toLowerCase();
    const amount = payment.amount.toString();
    return (
      payment.payeeName.toLowerCase().includes(searchLower) ||
      payment.status.toLowerCase().includes(searchLower) ||
      payment.paymentMode.toLowerCase().includes(searchLower) ||
      amount.includes(searchLower) ||
      formattedDate.includes(searchLower)
    );
  });

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  function formatMoney(totalAmount) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(totalAmount);
  }

  const openPayment = (paydata) => {
    setSelectedPayment(paydata);
    setShowPayment(true);
  };
  const closePayment = (e) => {
    e.preventDefault();
    setShowPayment(false);
  };

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-5 flex flex-col'>
      <div className='flex px-3 flex-row justify-between items-center'>
        <h1 className='text-2xl text-orange-500 font-bold'>Payment Details</h1>
        <div className='flex justify-center items-center'>
          <i className='material-icons text-2xl text-orange-500'>search</i>
          <input
            className='border-b p-2 outline-none text-neutrals-700 border-orange-500'
            placeholder='Search here...'
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className='w-full p-2'>
          <table className='w-full'>
            <thead className='bg-orange-500 text-TextColor rounded-lg'>
              <tr className=''>
                <th className=' rounded-tl-lg text-center p-2'>Date</th>
                <th className=' text-center p-2'>Client</th>
                <th className=' text-center p-2 '>Mode</th>
                <th className=' text-center p-2 '>Status</th>
                <th className='rounded-tr-lg text-center p-2 '>Amount</th>
              </tr>
            </thead>
            <tbody className='max-h-screen overflow-y-auto'>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    className='hover:bg-orange-200 hover:cursor-pointer transition-all hover:text-TextColor'
                    onClick={() => openPayment(payment)}
                  >
                    <td className='border p-2'>
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className='border p-2'>{payment.payeeName}</td>
                    <td className='border p-2'>{payment.paymentMode}</td>
                    <td className='border p-2'>
                      {payment.status === "subscribed" ||
                      payment.status === "expired"
                        ? "Paid"
                        : payment.status}
                    </td>
                    <td className='border p-2'>
                      {formatMoney(payment.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <div className='flex justify-center items-center'>
                  No Payment Transaction
                </div>
              )}
            </tbody>
          </table>
          {showPayment && (
            <PaymentDetails
              closePayment={closePayment}
              payments={selectedPayment}
              formatDate={formatDate}
              formatMoney={formatMoney}
            />
          )}
        </div>
      )}
    </div>
  );
}
