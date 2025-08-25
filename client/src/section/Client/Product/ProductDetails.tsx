import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Review = {
  id: number;
  productId: number;
  orderId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
};

export default function ProductDetails() {
  const location = useLocation();
  const { details } = location.state || {};
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductReviews = async () => {
      if (!details?.id) return;
      
      try {
        const token = sessionStorage.getItem("authToken");
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/reviews/product/${details.id}`,{
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            
          }
        );
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching product reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchProductReviews();
  }, [details?.id]);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="text-yellow-400">
          {i < rating ? "★" : "☆"}
        </span>
      ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="">
      <div className="fixed z-10 bottom-20 right-4 md:bottom-8 md:right-8">
        <a href="https://wa.me/94710500800" target="_blank">
          <img src="/client/product/icons8-whatsapp.gif" width="100%" />
        </a>
      </div>
      <div className="w-full px-5 mx-auto mt-24 max-w-1440 md:mt-32 sm:px-8 xl:px-10">
        <div
          id={details.id}
          className="flex flex-col w-full mb-5 gap-y-6 lg:gap-y-10"
        >
          <h1 className="flex justify-center text-3xl font-light uppercase text-black/70 font-anton md:text-3xl xl:text-5xl">
            {details.name}
          </h1>
          <hr className="-mt-3 border-2 border-black/70" />

          <div className="flex flex-col gap-y-5">
            <h1 className="text-base font-semibold text-orange-700 uppercase md:text-xl lg:text-2xl">
              recommended usage
            </h1>

            <div className="flex w-full relative justify-between h-20 sm-525:h-[100px] sm:h-[130px] md:h-[140px] lg:h-[160px] xl:h-[180px] ">
              <img
                src="/client/product/usage.webp"
                className="w-[360px] sm-525:w-[480px] sm:w-[580px] md:w-[650px] lg:w-[750px] xl:w-[850px] h-20 sm-525:h-[100px] sm:h-[130px] md:h-[140px] lg:h-[160px] xl:h-[180px] absolute "
              />
            </div>
          </div>

          <h1 className="text-base font-bold text-black uppercase md:text-xl lg:text-2xl">
            application method
          </h1>

          <div className="flex flex-col gap-y-6 lg:gap-y-8">
            <div>
              <h1 className="mb-1 text-sm font-semibold text-green-800 uppercase md:text-base xl:text-lg md:mb-2">
                mixing :
              </h1>
              <p className="text-sm leading-relaxed text-gray-800 md:text-sm xl:text-base">
                {details.mixing}
              </p>
            </div>

            <div>
              <h1 className="mb-1 text-sm font-semibold text-green-800 uppercase md:text-base xl:text-lg md:mb-2">
                APPLICATION METHOD :
              </h1>
              <p className="text-sm leading-relaxed text-gray-800 md:text-sm xl:text-base">
                {details.applicationMethod}
              </p>
            </div>

            <div>
              <h1 className="mb-1 text-sm font-semibold text-green-800 uppercase md:text-base xl:text-lg md:mb-2">
                storage :
              </h1>
              <p className="text-sm leading-relaxed text-gray-800 md:text-sm xl:text-base">
                {details.storage}
              </p>
            </div>
          </div>
          
          {/* Product Reviews Section */}
          <div className="mt-8">
            <h1 className="pb-2 text-base font-bold text-black uppercase border-b md:text-xl lg:text-2xl">
              Customer Reviews
            </h1>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-b-2 border-green-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-500">{error}</div>
            ) : reviews.length > 0 ? (
              <div className="mt-4 space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium">
                          {review.user?.name || "Anonymous"}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                    
                    {review.comment && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}