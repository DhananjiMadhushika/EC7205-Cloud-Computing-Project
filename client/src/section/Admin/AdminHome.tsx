import { Order } from "@/types/OrderTypes";

import {
  CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, LineElement,
  PointElement, Tooltip
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper } from "swiper/react";


ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AdminHome() {
  
  const [monthlySales, setMonthlySales] = useState<number>(0);
  const [todaySales, setTodaySales] = useState<number>(0);
  const [yearlySales, setYearlySales] = useState<number>(0);
  const [monthlySalesData, setMonthlySalesData] = useState<number[]>(Array(12).fill(0));
 
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          setLoading(false);
          return;
        }
  
        // Updated API endpoint to match your requirement
        const response = await fetch("http://localhost:3002/orders/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        const orders = await response.json();
      
        if (!orders || !Array.isArray(orders)) {
          console.error("Invalid orders data:", orders);
          setLoading(false);
          return;
        }
  
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const today = new Date().toDateString();
  
        let monthlySalesTotal = 0;
        let todaySalesTotal = 0;
        let yearlySalesTotal = 0;
        let pendingOrdersCount = 0;
        const monthlySalesData = Array(12).fill(0);
        const uniqueCustomers = new Set<string>();
  
        orders.forEach((order: Order) => {
          const orderDate = new Date(order.createdAt);
          const orderMonth = orderDate.getMonth();
          const orderYear = orderDate.getFullYear();
          const orderDateString = orderDate.toDateString();
          const orderAmount = typeof order.netAmount === 'string' ? 
            parseFloat(order.netAmount) : order.netAmount;
  
          // Add unique customers
          if (order.userId) {
            uniqueCustomers.add(order.userId);
          }
  
          // Count pending orders
          if (order.status === "PENDING") {
            pendingOrdersCount++;
          }
  
          // Monthly sales (current month)
          if (orderMonth === currentMonth && orderYear === currentYear) {
            monthlySalesTotal += orderAmount;
          }
  
          // Today's sales
          if (orderDateString === today) {
            todaySalesTotal += orderAmount;
          }
  
          // Yearly sales and monthly breakdown
          if (orderYear === currentYear) {
            yearlySalesTotal += orderAmount;
            monthlySalesData[orderMonth] += orderAmount;
          }
        });
  
        setMonthlySales(monthlySalesTotal);
        setTodaySales(todaySalesTotal);
        setYearlySales(yearlySalesTotal);
        setMonthlySalesData(monthlySalesData);
        
        
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

  

    fetchOrders();
    // Only fetch users if you have a separate user endpoint, otherwise customer count is derived from orders
    // fetchUsers();
  }, []);
  
  const stats = [
    {
      title: "Yearly Sales",
      value: loading ? "Loading..." : `LKR ${yearlySales.toLocaleString()}`,
      color: "text-red-400",
      icon: "📊",
    },
    {
      title: "Monthly Sales", 
      value: loading ? "Loading..." : `LKR ${monthlySales.toLocaleString()}`,
      color: "text-green-400",
      icon: "🛒",
    },
    {
      title: "Daily Sales",
      value: loading ? "Loading..." : `LKR ${todaySales.toLocaleString()}`,
      color: "text-red-400",
      icon: "📉",
    }
  ];

  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Monthly Sales (LKR)",
        data: monthlySalesData,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        labels: { color: "white" },
        position: 'top'
      },
      tooltip: { 
        mode: "index", 
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: LKR ${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: { 
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" }
      },
      y: { 
        ticks: { 
          color: "white",
          callback: function(value) {
            return ` ${Number(value).toLocaleString()}`;
          }
        },
        beginAtZero: true,
        grid: { color: "rgba(255, 255, 255, 0.1)" }
      },
    },
  };

  return (
    <div className="flex-1 p-4 md:p-6 xl:p-10 bg-[#262626] min-h-screen text-white rounded-2xl">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-3 mb-2 sm-525:grid-cols-2 lg:grid-cols-3 sm-525:gap-5 lg:gap-6 md:mb-4 ">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-black p-5 xl:p-6 rounded-xl transform transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center gap-y-1 sm:gap-y-2 lg:gap-y-2.5"
          >
            <div
              className={`${stat.color} text-lg flex items-center capitalize`}
            >
              <span className="mr-2 text-lg md:text-xl">{stat.icon}</span>
              {stat.title}
            </div>
            <div className="text-lg font-semibold md:text-xl xl:text-2xl md:font-bold">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Product Stock Section - You can add your Swiper content here */}
      <div className="flex items-start justify-between w-full mb-6">
        <div className="min-w-full">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              600: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000 }}
            loop={true}
          >
            {/* Add your product slides here */}
          </Swiper>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-black p-5 lg:p-7 rounded-xl w-full max-w-2.5xl mx-auto mt-6 lg:mt-8">
        <h2 className="mb-4 text-lg font-semibold md:text-xl">Sales</h2>
        <div className="h-[400px] md:h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          ) : (
            <Line data={data} options={options} />
          )}
        </div>
      </div>
    </div>
  );
}