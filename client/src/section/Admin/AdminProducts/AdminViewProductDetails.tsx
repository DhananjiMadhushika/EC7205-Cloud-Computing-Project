import { BackButton } from "@/components/button/BackButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Color {
  id: number;
  name: string;
  hexCode: string;
  isActive: boolean;
}

interface ProductColor {
  id: number;
  productId: number;
  colorId: number;
  color: Color;
}

interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    id: number;
    name: string;
  };
}

interface ProductDetails {
  id: number;
  name: string;
  productImage?: string;
  description?: string; // Added description field
  volume?: number;
  price: number;
  stock?: number;
  category?: Category;
  colors: ProductColor[]; // Changed from single color to array of ProductColor
  finish?: string;
  coverage?: string;
  dryingTime?: string;
  coats?: number;
  isActive: boolean;
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
}

function AdminViewProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product details.");
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading)
    return (
      <div className="mt-10 text-xl text-center text-white">Loading...</div>
    );
  if (error)
    return (
      <div className="mt-10 text-xl text-center text-red-500">{error}</div>
    );
  if (!product)
    return (
      <div className="mt-10 text-xl text-center text-red-500">
        Product not found!
      </div>
    );

  return (
    <div className="flex-1 p-4 md:p-6 xl:p-10 bg-[#262626] min-h-screen rounded-2xl">
      <BackButton />

      <h1 className="mt-8 mb-2 text-3xl text-center text-gray-300 uppercase lg:text-5xl font-anton md:mb-6 sm-525:mt-5">
        {product.name}
      </h1>
      <hr className="mb-5 border-2 border-white/70 md:mb-8" />

      {/* Product Info Section */}
      <div className="bg-[#3f4a703a] p-6 rounded-xl flex flex-col">
        <div className="flex flex-col justify-center gap-3 sm-525:flex-row sm-525:gap-5 xl:gap-10">
          {/* Left: Product Image */}
          <div className="flex justify-center p-2 border-2 border-green-400 rounded-2xl md:p-5 group hover:bg-black/40">
            <img
              src={product.productImage || "/placeholder.png"}
              alt={product.name}
              className="w-auto transition-all duration-300 sm-525:w-full h-52 md:h-64 group-hover:scale-105"
            />
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col items-center space-y-1 sm-525:space-y-2 xl:space-y-3 sm-525:items-start sm-525:justify-center">
            {/* Category and Colors Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.category && (
                <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
                  {product.category.name}
                </span>
              )}
              {/* Display all colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((productColor) => (
                    <div
                      key={productColor.id}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-full"
                    >
                      <div
                        className="w-4 h-4 border border-white rounded-full"
                        style={{ backgroundColor: productColor.color.hexCode }}
                      ></div>
                      {productColor.color.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Availability Status */}
            <p
              className={`text-lg md:text-2xl font-sans font-semibold ${
                (product.stock ?? 0) > 0 ? "text-green-400" : "text-red-500"
              }`}
            >
              {(product.stock ?? 0) > 0
                ? `Available (${product.stock} in stock)`
                : "Out of Stock"}
            </p>

            {/* Product Specifications */}
            {product.volume && (
              <p className="text-sm font-semibold text-white md:text-xl">
                Volume: {product.volume}L
              </p>
            )}
            
            <p className="text-sm font-semibold text-white md:text-xl">
              Price: Rs. {product.price}
            </p>

            {product.finish && (
              <p className="text-sm font-semibold text-white md:text-xl">
                Finish: {product.finish}
              </p>
            )}

            {product.coverage && (
              <p className="text-sm font-semibold text-white md:text-xl">
                Coverage: {product.coverage}
              </p>
            )}

            {product.dryingTime && (
              <p className="text-sm font-semibold text-white md:text-xl">
                Drying Time: {product.dryingTime}
              </p>
            )}

            {product.coats && (
              <p className="text-sm font-semibold text-white md:text-xl">
                Recommended Coats: {product.coats}
              </p>
            )}

            {/* Reviews count if available */}
            {product._count && (
              <p className="text-sm font-semibold text-white md:text-xl">
                Reviews: {product._count.reviews}
              </p>
            )}
          </div>
        </div>

        {/* Product Description Section */}
        {product.description && (
          <div className="mt-8">
            <h4 className="text-[#ffff66] font-semibold text-lg mb-4">PRODUCT DESCRIPTION</h4>
            <div className="p-4 rounded-lg bg-black/30">
              <p className="leading-relaxed text-white whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* Colors Section (if multiple colors) */}
        {product.colors && product.colors.length > 1 && (
          <div className="mt-8">
            <h4 className="text-[#ffff66] font-semibold text-lg mb-4">AVAILABLE COLORS</h4>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((productColor) => (
                <div
                  key={productColor.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/30"
                >
                  <div
                    className="w-8 h-8 border-2 border-white rounded-full"
                    style={{ backgroundColor: productColor.color.hexCode }}
                  ></div>
                  <span className="font-medium text-white">
                    {productColor.color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Product Information */}
        {(product.coverage || product.dryingTime || product.coats) && (
          <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
            {product.coverage && (
              <div className="p-4 rounded-lg bg-black/30">
                <h4 className="text-[#ffff66] font-semibold text-base mb-2">COVERAGE</h4>
                <p className="text-sm text-white">{product.coverage}</p>
              </div>
            )}
            
            {product.dryingTime && (
              <div className="p-4 rounded-lg bg-black/30">
                <h4 className="text-[#ffff66] font-semibold text-base mb-2">DRYING TIME</h4>
                <p className="text-sm text-white">{product.dryingTime}</p>
              </div>
            )}
            
            {product.coats && (
              <div className="p-4 rounded-lg bg-black/30">
                <h4 className="text-[#ffff66] font-semibold text-base mb-2">RECOMMENDED COATS</h4>
                <p className="text-sm text-white">{product.coats} coats for optimal finish</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Section (if reviews exist) */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-8">
            <h4 className="text-[#ffff66] font-semibold text-lg mb-4">CUSTOMER REVIEWS</h4>
            <div className="space-y-4 overflow-y-auto max-h-64">
              {product.reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="p-4 rounded-lg bg-black/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-white">{review.user.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < review.rating ? "text-yellow-400" : "text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Status */}
        <div className="flex justify-center mt-6">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              product.isActive
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {product.isActive ? "Active Product" : "Inactive Product"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminViewProductDetails;