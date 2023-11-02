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
  const [showFilter, setShowFilter] = useState(false);

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
          backgroundColor: "#F3782C",
          borderColor: "#414a4e",
          borderWidth: 1,
        },
        {
          label: "Expected Visits",
          data: expectedVisits,
          backgroundColor: "#862B2A",
          borderColor: "#414a4e",
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

  const showFiltering = (e) => {
    e.preventDefault();
    setShowFilter(!showFilter);
  };

  return (
    <div className='lg:ml-72 md:ml-72 sm:ml-72 p-5 font-inter'>
      <div className='w-full flex justify-center items-center'>
        <h1 className='text-orange-500 lg:text-4xl md:text-3xl text-2xl lg:font-bold font-semibold'>
          Analytics
        </h1>
      </div>
      <div className='grid grid-cols-3 lg:gap-10 md:gap-5 gap-2 p-5 border-b'>
        <div className='border h-28 max-h-28 border-orange-500 flex justify-center items-center flex-col'>
          <h1 className='lg:text-2xl lg:font-bold text-xl font-semibold text-orange-500'>
            {profileVisit.length}
          </h1>
          <h1 className='text-neutrals-500 lg:text-xl md:text-xl sm:text-md text-sm text-center'>
            Profile Visit
          </h1>
          <i className='material-icons text-neutrals-500'>person</i>
        </div>
        <div className='border h-28 max-h-28 border-orange-500 flex justify-center items-center flex-col'>
          <h1 className='lg:text-2xl lg:font-bold text-xl font-semibold text-orange-500'>
            {totalRev.length}
          </h1>
          <h1 className='text-neutrals-500 lg:text-xl md:text-xl sm:text-md text-sm text-center'>
            Customer Engagement
          </h1>
          <i className='material-icons text-neutrals-500'>notifications</i>
        </div>
        <div className='border h-28 max-h-28 border-orange-500 flex justify-center items-center flex-col'>
          <h1 className='lg:text-2xl lg:font-bold text-xl font-semibold text-orange-500'>
            {postVisit}
          </h1>
          <h1 className='text-neutrals-500 lg:text-xl md:text-xl sm:text-md text-sm text-center'>
            Total of Post Click
          </h1>
          <i className='material-icons text-neutrals-500'>insert_drive_file</i>
        </div>
      </div>
      <div className='flex flex-col'>
        <div
          className='w-24 border border-orange-500 flex justify-between items-center p-1 hover:cursor-pointer'
          onClick={showFiltering}
        >
          <button>Filter</button>
          <i className='material-icons text-orange-500'>event</i>
        </div>
        <div className='w-40 relative rounded-xl'>
          {showFilter && (
            <div className='w-40 flex-col absolute top-[100%] left-0 bg-TextColor rounded-xl'>
              <label className='text-orange-500'>Start Date:</label>
              <input
                className='w-full outline-none text-neutrals-500'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <label className='text-orange-500'>End Date:</label>
              <input
                className='w-full outline-none text-neutrals-500'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className='w-full border p-2 mt-2'>
          <div className='w-full'>
            <h1 className='text-center text-2xl font-semibold'>
              Customer Engagement
            </h1>
            <Line data={lineChartData} />
          </div>
        </div>
        <div className='lg:grid lg:grid-cols-2 gap-2 mt-2'>
          <div className='flex flex-col shadow-xl justify-center items-center w-full border p-2 mb-2'>
            <h1 className='text-center text-2xl font-semibold'>
              Email Analytics
            </h1>
            <Bar data={generateGroupedBarChartData()} options={chartOptions} />
          </div>
          <div className='flex flex-col shadow-xl justify-center items-center border p-2 w-full'>
            <div className='w-full flex'>
              <div className='w-full'>
                {chartData && chartData.data && chartData.data.labels ? (
                  <div className='w-full'>
                    <h1 className='text-center text-2xl font-semibold'>
                      Ratings
                    </h1>
                    <Pie data={chartData.data} options={chartData.options} />
                  </div>
                ) : (
                  <div className='text-center text-2xl font-semibold'>
                    No ratings Yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
