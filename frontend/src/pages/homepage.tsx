import React, { useEffect, useState } from "react";
import { Gallery, Layout, Render } from "../components/"; // Replace with actual imports
import { getRequest } from "../api"; // Replace with actual API call
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Line } from "react-chartjs-2";
import "swiper/css";
import "swiper/css/pagination";


 
import "../App.css"; // Core Swiper styles
 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export const theme = [
  
	"Love",
	"Redemption",
	"Family",
	"Oppression",
	"Corruption",
	"Survival",
	"Revenge",
	"Death",
	"Justice",
	"Perseverance",
	"War",
	"Bravery",
	"Freedom",
	"Friendship",
	"Hope",
	"Society",
	"Isolation",
	"Peace",
];

const Homepage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<any>([]);
  const [genreChartData, setGenreChartData] = useState<any>(null);
  const [themeChartData, setThemeChartData] = useState<any>(null);
  const [ratingChartData, setRatingChartData] = useState<any>(null); // State for rating chart data
  const [data, setData] = useState<any>([]);
  const [showMoreIndex, setShowMoreIndex] = useState<number | null>(null);
  const nav = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchGenreChartData = async () => {
      try {
        setLoading(true);
        const genreData: any = await getRequest("/video/genres/graph", setLoading);
        if (isMounted && genreData) {
          const labels = Object.keys(genreData[Object.keys(genreData)[0]]);
          const datasets = Object.keys(genreData).map((genre: string) => ({
            label: genre,
            data: labels.map((week: string) => genreData[genre][week]?.count || 0),
            borderColor: getRandomColor(),
            backgroundColor: getRandomColor(),
            lineTension: 0.4,
          }));
          setGenreChartData({ labels, datasets });
        }
      } catch (error) {
        console.error("Error fetching genre chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchThemeChartData = async () => {
      try {
        setLoading(true);
        const themeData: any = await getRequest("/video/themes/graph", setLoading);
        if (isMounted && themeData) {
          const labels = Object.keys(themeData[Object.keys(themeData)[0]]);
          const datasets = Object.keys(themeData).map((theme: string) => ({
            label: theme,
            data: labels.map((week: string) => themeData[theme][week]?.count || 0),
            borderColor: getRandomColor(),
            backgroundColor: getRandomColor(),
            lineTension: 0.4,
          }));
          setThemeChartData({ labels, datasets });
        }
      } catch (error) {
        console.error("Error fetching theme chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRatingChartData = async () => { // New function for fetching rating data
      try {
        setLoading(true);
        const ratingData: any = await getRequest("/video/ratings/graph", setLoading);
        if (isMounted && ratingData) {
          const labels = Object.keys(ratingData[Object.keys(ratingData)[0]]);
          const datasets = Object.keys(ratingData).map((rating: string) => ({
            label: rating,
            data: labels.map((week: string) => ratingData[rating][week]?.count || 0),
            borderColor: getRandomColor(),
            backgroundColor: getRandomColor(),
            lineTension: 0.4,
          }));
          setRatingChartData({ labels, datasets });
        }
      } catch (error) {
        console.error("Error fetching rating chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchScripts = async () => {
      const result: any = await getRequest("video/author/scripts", setLoading);
      if (isMounted && result) {
        setScripts(result.map((res: any) => res.script));
        setData(result);
      }
    };

    fetchGenreChartData();
    fetchThemeChartData();
    fetchRatingChartData(); // Fetch rating chart data
    fetchScripts();

    return () => {
      isMounted = false;
    };
  }, []);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top", // Use valid literal type
        labels: {
          color: "white",
          font: {
            size: 8,
          },
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Rise and Fall of Different Genres/Themes/Ratings Over Time",
        color: "white",
        font: {
          size: 12,
          weight: "bold", // Valid type for weight
        },
        padding: {
          top: 1,
          bottom: 10,
        },
      },
      tooltip: {
        enabled: true,
        bodyFont: {
          size: 10,
        },
        titleFont: {
          size: 10,
        },
        padding: 8,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Popularity Metric (Views/Uploads)",
          color: "white",
          font: {
            size: 10,
          },
        },
        ticks: {
          color: "white",
          font: {
            size: 9,
          },
        },
      },
      x: {
        reverse: true,
        title: {
          display: true,
          text: "Time (Weeks)",
          color: "white",
          font: {
            size: 10,
          },
          padding: {
            bottom: 20,
          },
        },
        ticks: {
          color: "white",
          font: {
            size: 10,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 1,
      },
      point: {
        radius: 3,
        hoverRadius: 3,
      },
    },
  };
  const handleScriptMouseEnter = (index: number) => {
    setShowMoreIndex(index);
  };

  const handleScriptMouseLeave = () => {
    setShowMoreIndex(null);
  };

  return (
    <Layout expand={false}>
   <div className="textured-background">
      <h1 className="chart-heading">WECINEMA</h1>
      <p className="chart-subheading">
        Genre, Theme, and Rating Popularity Over Time
      </p>

      {/* Popup for swipe right */}
      {showPopup && (
        <div className="popup">
          <p>Swipe right to view more charts!</p>
        </div>
      )}

      {window.innerWidth < 768 ? (
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1}
          className="mobile-swiper"
        >
          {[genreChartData, themeChartData, ratingChartData].map(
            (chartData, idx) => (
              <SwiperSlide key={idx} className="swiper-slide">
                <div className="chart-container">
                  {!loading && chartData && (
                    <Line data={chartData} options={chartOptions} />
                  )}
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      ) : (
        <div
          className={`chart-wrapper ${
            window.innerWidth >= 1024 ? "chart-wrapper-lg" : ""
          }`}
        >
          {[genreChartData, themeChartData, ratingChartData].map(
            (chartData, idx) => (
              <div key={idx} className="chart-container">
                {!loading && chartData && (
                  <Line data={chartData} options={chartOptions} />
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-1 gap-4 ml-4">
                 {/* Theme List Bar */}
                 <div className="overflow-x-auto flex gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 border-b border-gray-300 w-screen -mx-4 px-4 sm:mx-0 sm:w-auto">
  {theme.map((val, index) => (
    <button
      key={index}
      onClick={() => nav(`/themes/${val.toLowerCase()}`)}
      className="bg-yellow-500 text-white text-sm sm:text-base px-2 sm:px-3 py-1 rounded-full whitespace-nowrap hover:bg-yellow-600 transition-all"
    >
      {val}
    </button>
  ))}
</div>

      </div>

 
        {/* Gallery and Scripts Section */}
      <Gallery title="Action" category="Action" length={5} isFirst />
      <Gallery title="Comedy" length={5} category="Comedy" />
      <Gallery title="Adventure" length={5} category="Adventure" />
      <Gallery title="Horror" length={5} category="Horror" />
      <Gallery title="Drama" length={5} category="Drama" />
      <div className="z-1 relative p-2 flex flex-wrap border-b border-blue-200 sm:mx-4 pb-4">
				{!loading && (
					<h2 className="text-l font-extrabold text-lg sm:text-xl">Scripts</h2>
				)}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

					{scripts?.map((script: string, index: number) => (
						<div
							key={index}
							className={`${
								showMoreIndex === index
									? "bg-black text-white bg-opacity-50 overflow-y-auto"
									: "bg-white text-black overflow-y-hidden"
							} overflow-y-hidden hide-scrollbar border w-full max-h-64 text-slate-950 p-4 rounded-sm relative`}
							onMouseEnter={() => handleScriptMouseEnter(index)}
							onMouseLeave={handleScriptMouseLeave}
							onClick={() =>
								nav(`/script/${data[index]._id}`, {
									state: JSON.stringify(data[index]),
								})
							}
						>
							<h2>{data[index].title}</h2>
							{showMoreIndex === index && (
								<button
									className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-2 py-1 rounded-md"
									onClick={() => console.log("Read more clicked")}
								>
									Read More
								</button>
							)}
							<Render htmlString={script} />
						</div>
            
					))}
				</div>
			</div>
    </Layout>
  );
};

export default Homepage;
