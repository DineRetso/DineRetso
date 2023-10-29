import React, { useEffect, useState, useRef, useCallback } from "react";
import { getError } from "../utils";
import LoadingSpinner from "../Components/LoadingSpinner";
import axios from "axios";
import { Chart as ChartJS, LineElement, BarElement } from "chart.js";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

ChartJS.register(LineElement, BarElement);
export default function Dashboard() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [restoData, setRestoData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorResto, setErrorResto] = useState("");
  const [errorPayment, setErrorPayment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchResto = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/getRestaurants", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });
        const filteredResto = response.data.filter((resto) => {
          const restoDate = new Date(resto.createdAt);
          return (
            (!startDate || restoDate >= new Date(startDate)) &&
            (!endDate || restoDate <= new Date(endDate))
          );
        });
        setRestoData(filteredResto);
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setErrorResto(getError(error));
        setLoading(false);
      }
    };
    const fetchPayment = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/getPayments", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });
        if (response.status === 200) {
          const filteredPayments = response.data.filter((payment) => {
            return (
              payment.status === "expired" || payment.status === "subscribed"
            );
          });
          const filteredDate = filteredPayments.filter((fD) => {
            const reviewDate = new Date(fD.startDate);
            return (
              (!startDate || reviewDate >= new Date(startDate)) &&
              (!endDate || reviewDate <= new Date(endDate))
            );
          });
          filteredDate.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
          );
          setPaymentData(filteredDate);
        } else {
          setErrorPayment("Payment Unavailable");
        }
        setLoading(false);
      } catch (error) {
        console.error(getError(error));
        setErrorPayment(getError(error));
        setLoading(false);
      }
    };
    fetchResto();
    fetchPayment();
  }, [dineInfo.token, startDate, endDate, setPaymentData]);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  const dataByDate = new Map();
  paymentData.forEach((payment) => {
    const formattedDate = formatDate(payment.startDate);
    if (dataByDate.has(formattedDate)) {
      dataByDate.set(
        formattedDate,
        dataByDate.get(formattedDate) + payment.totalAmount
      );
    } else {
      dataByDate.set(formattedDate, payment.totalAmount);
    }
  });
  const sortedDates = Array.from(dataByDate.keys()).sort((a, b) => {
    return new Date(a) - new Date(b);
  });
  const totalAmounts = sortedDates.map((date) => dataByDate.get(date));
  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Total Income",
        data: totalAmounts,
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  const groupedData = {};
  restoData.forEach((restaurant) => {
    const category = restaurant.category;
    const formattedDate = formatDate(restaurant.createdAt);

    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = {
        Famous: 0,
        Local: 0,
        Unique: 0,
      };
    }

    groupedData[formattedDate][category]++;
  });
  const barData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: "Famous",
        data: Object.keys(groupedData).map((date) => groupedData[date].Famous),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Local",
        data: Object.keys(groupedData).map((date) => groupedData[date].Local),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
      {
        label: "Unique",
        data: Object.keys(groupedData).map((date) => groupedData[date].Unique),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };
  const barOptions = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const showFiltering = (e) => {
    e.preventDefault();
    setShowFilter(true);
  };
  const closeFiltering = (e) => {
    e.preventDefault();
    setShowFilter(false);
  };

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 font-inter'>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className='w-full flex flex-col p-5 space-y-2'>
          <div
            className='w-24 border border-orange-500 flex justify-between items-center p-1 hover:cursor-pointer'
            onClick={showFiltering}
          >
            <button>Filter</button>
            <i className='material-icons text-orange-500'>event</i>
          </div>
          <div className='w-32 relative'>
            {showFilter && (
              <div className='w-32 flex-col absolute top-[100%] left-0'>
                <label>Start Date:</label>
                <input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label>End Date:</label>
                <input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <div>
                  <button onClick={closeFiltering}>Close</button>
                </div>
              </div>
            )}
          </div>
          <div className='w-full flex flex-row space-x-2'>
            <div className='max-w-[60%] w-[60%] border overflow-x-auto p-2'>
              <div className='w-full flex flex-row justify-start items-center '>
                <i className='material-icons text-orange-500 font-thin'>
                  trending_up
                </i>
                <h1 className='font-semibold text-xl text-neutrals-700'>
                  Income Statistics
                </h1>
              </div>
              <Line data={chartData} />
            </div>
            <div className='border h-72 max-h-72 overflow-y-auto w-[40%] flex flex-col justify-start items-center'>
              <div className='w-full flex flex-row justify-start items-start h-full'>
                <i className='material-icons text-orange-500 font-thin'>
                  restaurant
                </i>
                <h1 className='font-semibold text-xl text-neutrals-700'>
                  Restaurant Statistics
                </h1>
              </div>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          <div className='w-full flex flex-row space-x-2'>
            <div className='max-w-[60%] w-[60%] border overflow-x-auto p-2'>
              <div className='w-full flex flex-row justify-start items-center '>
                <i className='material-icons text-orange-500 font-thin'>done</i>
                <h1 className='font-semibold text-xl text-neutrals-700'>
                  Recently Approved Restaurants
                </h1>
              </div>
              <table className='text-sm w-full'>
                <thead className='bg-orange-500 text-TextColor'>
                  <tr className=''>
                    <th className=' text-center p-1 text-[12px]'>Name</th>
                    <th className=' text-center p-1 text-[12px]'>Category</th>
                    <th className=' text-center p-1 text-[12px]'>Status</th>
                    <th className=' text-center p-1 text-[12px]'>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {errorResto
                    ? { errorResto }
                    : restoData.map((resto) => (
                        <tr
                          key={resto._id}
                          className='border text-neutrals-700'
                        >
                          <td className='p-1 text-[12px]'>{resto.resName}</td>
                          <td className='p-1 text-[12px]'>{resto.category}</td>
                          <td className='p-1 text-[12px]'>
                            {resto.isSubscribed}
                          </td>
                          <td className='p-1 text-[12px]'>{resto.address}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className='border h-72 max-h-72 overflow-y-auto w-[40%] p-2'>
              <div className='w-full flex flex-row justify-start items-center'>
                <i className='material-icons text-orange-500 font-thin'>
                  payment
                </i>
                <h1 className='font-semibold text-xl text-neutrals-700'>
                  Recent Payment
                </h1>
              </div>
              <table className='text-sm w-full'>
                <thead className='bg-orange-500 text-TextColor'>
                  <tr className=''>
                    <th className=' text-center p-1 text-[12px]'>Date</th>
                    <th className=' text-center p-1 text-[12px]'>Client</th>
                    <th className=' text-center p-1 text-[12px]'>Mode</th>
                    <th className=' text-center p-1 text-[12px]'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentData.map((payment) => (
                    <tr key={payment._id} className='border text-neutrals-700'>
                      <td className='p-1 text-[12px]'>
                        {formatDate(payment.startDate)}
                      </td>
                      <td className='p-1 text-[12px]'>{payment.payeeName}</td>
                      <td className='p-1 text-[12px]'>{payment.paymentMode}</td>
                      <td className='p-1 text-[12px]'>{payment.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
