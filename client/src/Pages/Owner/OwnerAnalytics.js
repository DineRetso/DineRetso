import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function OwnerAnalytics() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [reviews, setReviews] = useState([]);
  const [chartData, setChartData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(
          `/api/owner/approved-reviews/${userInfo.myRestaurant}`,
          {
            params: {
              startDate,
              endDate,
            },
          }
        );
        setReviews(response.data);
        createChartData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchReviews();
  }, [userInfo.myRestaurant, startDate, endDate]);

  // Create the chart data based on the reviews
  const createChartData = (reviews) => {
    const filteredReviews = reviews.filter((review) => {
      const reviewDate = new Date(review.createdAt);
      return (
        (!startDate || reviewDate >= new Date(startDate)) &&
        (!endDate || reviewDate <= new Date(endDate))
      );
    });
    const labels = ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"];
    const data = Array(5).fill(0);

    filteredReviews.forEach((review) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        data[rating - 1]++;
      }
    });

    const backgroundColor = [
      "#FED720",
      "#F6BA94",
      "#FEEBA9",
      "#FFAA76",
      "#F3782C",
    ];

    const hoverOffset = 4;

    const config = {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Ratings Distribution",
            data: data,
            backgroundColor: backgroundColor,
            hoverOffset: hoverOffset,
          },
        ],
      },
    };

    setChartData(config);
  };

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-5'>
      <div>
        <h1>Analytics</h1>
      </div>
      <div className='grid grid-cols-3 lg:gap-10 md:gap-8 gap-5 p-5 border-b'>
        <div className='border h-28 max-h-28'>
          <h1>Profile Visit</h1>
          <i className='material-icons'>person</i>
        </div>
        <div className='border h-28 max-h-28'>
          <h1>Customer Engagement</h1>
          <i className='material-icons'>favorite</i>
        </div>
        <div className='border h-28 max-h-28'>
          <h1>Total of Post Click</h1>
          <i className='material-icons'>insert_drive_file</i>
        </div>
      </div>
      <div className='flex'>
        <div className='w-1/2'></div>
        <div className='w-1/2'>
          <div>
            <h1>Ratings</h1>
            <label htmlFor='fromDate'>From: </label>
            <input
              type='date'
              id='fromDate'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor='toDate'>To: </label>
            <input
              type='date'
              id='toDate'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className='w-full flex'>
            <div className='w-1/2'></div>
            <div>
              {chartData && chartData.data && chartData.data.labels ? (
                <div>
                  <h1>Pie</h1>
                  <Pie data={chartData.data} />
                </div>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
