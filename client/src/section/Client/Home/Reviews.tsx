import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface User {
  name: string;
}

interface Review {
  id: number;
  productId: number;
  orderId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

const fakeReviews: Review[] = [
  {
    id: 1001,
    productId: 1,
    orderId: 2001,
    userId: 3001,
    rating: 5,
    comment: "Absolutely love this product! The quality exceeded my expectations and shipping was super fast.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: { name: "Sampath Perera" }
  },
  {
    id: 1002,
    productId: 2,
    orderId: 2002,
    userId: 3002,
    rating: 4.5,
    comment: "Great value for money. Would definitely recommend to anyone looking for reliable quality.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: { name: "Mahinda Fernando" }
  },
  {
    id: 1003,
    productId: 3,
    orderId: 2003,
    userId: 3003,
    rating: 5,
    comment: "Customer service was excellent! They helped me choose the perfect item and followed up after delivery.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: { name: "Amanda de silva" }
  },
  {
    id: 1004,
    productId: 2,
    orderId: 2004,
    userId: 3004,
    rating: 4,
    comment: "This is my second purchase and I'm just as impressed as the first time. Very consistent quality.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: { name: "Kamal Perera" }
  }
];

const colorPairs = [
  { bg: "bg-blue-200", text: "text-blue-600" },
  { bg: "bg-red-200", text: "text-red-600" },
  { bg: "bg-gray-200", text: "text-gray-600" },
  { bg: "bg-green-200", text: "text-green-600" },
  { bg: "bg-purple-200", text: "text-purple-600" },
  { bg: "bg-cyan-200", text: "text-cyan-600" },
  { bg: "bg-indigo-200", text: "text-indigo-600" },
  { bg: "bg-teal-200", text: "text-teal-600" }
];

const getAvatarColor = (userId: number): string => {
  const colorIndex = (userId || 0) % colorPairs.length;
  return colorPairs[colorIndex].bg;
};

const getTextColor = (userId: number): string => {
  const colorIndex = (userId || 0) % colorPairs.length;
  return colorPairs[colorIndex].text;
};

const Reviews = () => {
  return (
    <>
      {/* Show meshBg on medium and larger screens */}
      <div
        className="hidden w-full bg-center bg-cover md:block"
        style={{ backgroundImage: `url('/client/hero/reviewBg.webp')` }}
      >
        <Content />
      </div>

      {/* Show bgSmall on small screens */}
      <div
        className="w-full bg-center bg-cover md:hidden"
        style={{ backgroundImage: `url('/client/hero/reviewBg.webp')` }}
      >
        <Content />
      </div>
    </>
  );
};

const Content = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        setLoading(true);
        const response = await axios.get<Review[]>("http://localhost:5000/api/reviews", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        
        const fetchedReviews = response.data;
        setReviews(fetchedReviews.length > 0 ? fetchedReviews : fakeReviews);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        setReviews(fakeReviews);
        setError(null);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - rating < 1) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="h-[400px] lg:h-[450px] bg-opacity-10 bg-black flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="h-[400px] lg:h-[450px] bg-opacity-10 bg-black">
      <section className="flex flex-col items-center w-full px-5 pt-10 mx-auto md:pt-12 max-w-1440 md:items-start sm:px-8 xl:px-10">
        <h1 className="mb-1 text-3xl uppercase font-anton md:tracking-wide text-black/60 lg:text-5xl sm:mb-2">
          What Our Customers Say
        </h1>
        <hr className="flex w-full border-2 border-black" />

        <div className="flex items-start justify-between w-full my-10 lg:my-16">
          <div className="min-w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 4000 }}
              loop={reviews.length > 3}
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id} className="px-2 pb-4">
                  <div className="flex flex-col w-full p-5 bg-gray-100 shadow-xl rounded-xl">
                    <div className="flex items-center w-full">
                      <div className={`w-14 h-14 rounded-full mb-4 border-2 border-gray-300 ${getAvatarColor(review.userId)} flex items-center justify-center ${getTextColor(review.userId)} font-bold text-2xl`}>
                        {review.user?.name ? review.user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <h3 className="ml-5 text-lg font-semibold">
                        {review.user?.name || "Anonymous User"}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 text-center h-[60px] xl:h-[50px] xl:line-clamp-2 line-clamp-3">
                      {review.comment || "No comment provided"}
                    </p>
                    <div className="flex mt-4">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;