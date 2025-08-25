import { Order } from "@/types/OrderTypes";
import { Product } from "@/types/ProductType";
import {
  CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, LineElement,
  PointElement, Tooltip
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import putty from "/client/product/putty.png";

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
  const [customerCount, setCustomerCount] = useState<number>(0);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }
  
        const response = await fetch("http://localhost:5000/api/orders/index", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        const result = await response.json();
      
        if (response.status === 200) {
          const orders = result;
  
          if (!orders || !Array.isArray(orders)) {
            console.error("Invalid orders data:", orders);
            return;
          }
  
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          const today = currentDate.getDate();
  
          let monthlySalesTotal = 0;
          let todaySalesTotal = 0;
          let yearlySalesTotal = 0;
          const monthlySalesData = Array(12).fill(0);
  
          orders.forEach((order: Order) => {
            const orderDate = new Date(order.createdAt);
            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();
            const orderDay = orderDate.getDate();
  
            if (orderMonth === currentMonth && orderYear === currentYear) {
              monthlySalesTotal += parseFloat(order.netAmount);
              if (orderDay === today) {
                todaySalesTotal += parseFloat(order.netAmount);
              }
            }
  
            if (orderYear === currentYear) {
              yearlySalesTotal += parseFloat(order.netAmount);
              monthlySalesData[orderMonth] += parseFloat(order.netAmount);
            }
          });

  
          setMonthlySales(monthlySalesTotal);
          setTodaySales(todaySalesTotal);
          setYearlySales(yearlySalesTotal);
          setMonthlySalesData(monthlySalesData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };



    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }
    
        const response = await fetch("http://localhost:5000/api/users/", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
    
        const result = await response.json();
        console.log("API Response:", result);
    
        if (response.status === 200) {
          const customers = result.filter((user: any) => user.role === "USER");
          setCustomerCount(customers.length);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchOrders();
    fetchUsers();
  }, []);
  
 

  
  const stats = [
    {
      title: "Yearly Sales",
      value: `LKR ${yearlySales.toLocaleString()}`,
      color: "text-red-400",
      icon: "📊",
    },
    {
      title: "Monthly Sales",
      value: `LKR ${monthlySales.toLocaleString()}`,
      color: "text-green-400",
      icon: "🛒",
    },
    {
      title: "Daily Sales",
      value: `LKR ${todaySales.toLocaleString()}`,
      color: "text-red-400",
      icon: "📉",
    },
    
    
    {
      title: "Customers",
      value: customerCount.toString(),
      color: "text-green-400",
      icon: "👥"
    }
  ];



  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales",
        data: monthlySalesData,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
      }
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "white" } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" }, beginAtZero: true },
    },
  };

  return (
    <div className="flex-1 p-4 md:p-6 xl:p-10 bg-[#262626] min-h-screen text-white rounded-2xl">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-3 mb-2 sm-525:grid-cols-2 lg:grid-cols-4 sm-525:gap-5 lg:gap-6 md:mb-4 ">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-black p-5 xl:p-6 rounded-xl transform transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center gap-y-1 sm:gap-y-2 lg:gap-y-2.5"
          >
            <div
              className={`${stat.color} text-lg flex items-center capitalize`}
            >
              <span className="mr-2 text-lg md:text-2xl ">{stat.icon}</span>
              {stat.title}
            </div>
            <div className="text-lg font-semibold md:text-xl xl:text-2xl md:font-bold">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Product Stock Section */}
      <div className="flex items-start justify-between w-full">
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
           
          </Swiper>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-black p-5 lg:p-7 rounded-xl w-full max-w-2.5xl mx-auto mt-6 lg:mt-8">
            <h2 className="mb-4 text-lg font-semibold md:text-xl">Sales vs Receivable</h2>
            <div className="h-[400px] md:h-[300px]">
              <Line data={data} options={options} />
            </div>
          </div>
    </div>
  );
}