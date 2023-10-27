import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { getError } from "../../utils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);
export default function OwnerAnalytics() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [reviews, setReviews] = useState([]);
  const [chartData, setChartData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRev, setTotalRev] = useState([]);
  const [postVisit, setPostVisit] = useState("");
  const [menuRev, setMenuRev] = useState([]);
  const [resRev, setResRev] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailAnalytics, setEmailAnalytics] = useState([]);
  const [profileVisit, setProfileVisit] = useState([]);

  const [lineChartData, setLineChartData] = useState({
    labels: [], // X-axis labels (e.g., dates)
    datasets: [
      {
        label: "Total Reviews",
        data: [], // Y-axis data (e.g., the number of reviews)
        borderColor: "blue", // Line color
        borderWidth: 2, // Line width
      },
    ],
  });

  useEffect(() => {
    const fetchReviews = async () => {
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
        console.error(getError(error));
        setError(getError(error));
      }
    };
    const fetchAllReview = async () => {
      try {
        const response = await axios.get(
          `/api/owner/restaurant/${userInfo.fName}/${userInfo.myRestaurant}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (response) {
          const menus = response.data.menu || [];
          const resRev = response.data.restoReview || [];
          const profileVisit = response.data.visits || [];
          const totalRev = [
            ...resRev,
            ...menus.flatMap((menuItem) => menuItem.menuReview),
          ];
          applyDateFilter(totalRev);
          setTotalRev(totalRev);
          setProfileVisit(profileVisit);
        } else {
          setError("No Restaurant Found");
        }
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
      }
    };

    const fetchEmailAnalytics = async () => {
      const status = "Approved";
      try {
        const response = await axios.get(
          `/api/owner/getPosting/${userInfo.myRestaurant}/${status}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (response.data) {
          // Extract and process data to create the grouped bar chart dataset
          const totalVisits = response.data.reduce((total, item) => {
            return total + item.visits.length;
          }, 0);

          setPostVisit(totalVisits);
          const analyticsData = response.data.map((item) => ({
            date: new Date(item.createdAt).toDateString(),
            emailVisits: item.visits.filter((visit) => visit.source === "email")
              .length,
            expectedVisits: item.expectedVisit || 0,
          }));
          const groupedData = analyticsData.reduce((acc, dataPoint) => {
            const existingData = acc.find(
              (group) => group.date === dataPoint.date
            );
            if (existingData) {
              existingData.emailVisits += dataPoint.emailVisits;
              existingData.expectedVisits += dataPoint.expectedVisits;
            } else {
              acc.push(dataPoint);
            }
            return acc;
          }, []);
          setEmailAnalytics(groupedData);
        }
      } catch (error) {
        console.error(getError(error));
        setError(getError(error));
      }
    };

    fetchReviews();
    fetchAllReview();
    fetchEmailAnalytics();
  }, [
    userInfo.myRestaurant,
    userInfo.fName,
    userInfo.token,
    startDate,
    endDate,
    setReviews,
    setPostVisit,
  ]);

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
      options: {
        plugins: {
          legend: {
            position: "left",
          },
        },
        aspectRatio: 3,
      },
    };

    setChartData(config);
  };

  const applyDateFilter = (rev) => {
    const filteredData = rev.filter((review) => {
      const reviewDate = new Date(review.createdAt);
      return (
        (!startDate || reviewDate >= new Date(startDate)) &&
        (!endDate || reviewDate <= new Date(endDate))
      );
    });

    const dates = filteredData.map((review) =>
      new Date(review.createdAt).toLocaleDateString()
    );
    const dateCountMap = dates.reduce((acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const chartLabels = Object.keys(dateCountMap);
    const chartData = Object.values(dateCountMap);

    setLineChartData({
      labels: chartLabels,
      datasets: [
        {
          label: "Total Reviews",
          data: chartData,
          borderColor: "#F3782C",
          borderWidth: 2,
        },
      ],
    });
  };

  const generateGroupedBarChartData = () => {
    const filteredEmailAnalytics = emailAnalytics.filter((data) => {
      const dataDate = new Date(data.date);
      return (
        (!startDate || dataDate >= new Date(startDate)) &&
        (!endDate || dataDate <= new Date(endDate))
      );
    });
    const labels = filteredEmailAnalytics.map((data) => data.date);
    const emailVisits = filteredEmailAnalytics.map((data) => data.emailVisits);
    const expectedVisits = filteredEmailAnalytics.map(
      (data) => data.expectedVisits
    );

    return {
      labels,
      datasets: [
        {
          label: "Email Visits",
          data: emailVisits,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Expected Visits",
          data: expectedVisits,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
        suggestedMax:
          Math.max(emailAnalytics.map((data) => data.expectedVisits)) + 1,
      },
    },
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
          <h1>{profileVisit.length}</h1>
        </div>
        <div className='border h-28 max-h-28'>
          <h1>Customer Engagement</h1>
          <i className='material-icons'>favorite</i>
          <h1>{totalRev.length}</h1>
        </div>
        <div className='border h-28 max-h-28'>
          <h1>Total of Post Click</h1>
          <i className='material-icons'>insert_drive_file</i>
          <h1>{postVisit}</h1>
        </div>
      </div>
      <div className='flex flex-col'>
        <div>
          <label htmlFor='startDate'>Start Date: </label>
          <input
            type='date'
            id='startDate'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor='endDate'>End Date: </label>
          <input
            type='date'
            id='endDate'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className='w-full '>
          <div className='line-chart-container'>
            <h1>Customer Engagement</h1>
            <Line data={lineChartData} />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col shadow-xl justify-center items-center'>
            <h1>Email Analytics</h1>

            <Bar data={generateGroupedBarChartData()} options={chartOptions} />
          </div>
          <div className='flex flex-col shadow-xl justify-center items-center'>
            <div className='w-full flex max-h-60 object-cover'>
              <div className='w-full'>
                {chartData && chartData.data && chartData.data.labels ? (
                  <div>
                    <h1>Ratings</h1>
                    <Pie data={chartData.data} options={chartData.options} />
                  </div>
                ) : (
                  <div>No ratings Yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
