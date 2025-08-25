import { Product } from "@/types/ProductType";
import { showToastinfo } from "@/utils/toast/infoToast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null); // New state for selected color

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.productImage);
        
        // Auto-select first color if available
        if (response.data.colors && response.data.colors.length > 0) {
          setSelectedColorId(response.data.colors[0].color.id);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        showToastinfo("Product not found");
        navigate("/e-shop");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      showToastinfo("Please log in first to add items to cart.");
      return;
    }

    // Check if color selection is required
    if (product?.colors && product.colors.length > 0 && !selectedColorId) {
      showToastinfo("Please select a color before adding to cart.");
      return;
    }
    
    try {
      const cartData = {
        productId: product?.id,
        quantity: quantity,
        colorId: selectedColorId // Include selected color
      };

      const response = await axios.post(
        "http://localhost:5000/api/cart",
        cartData,
        {
          headers: {
            Authorization:token
          }
        }
      );

      if(response.status === 200){
        navigate("/cart");
      }

      const selectedColorName = product?.colors?.find(pc => pc.color.id === selectedColorId)?.color.name;
      const colorText = selectedColorName ? ` (${selectedColorName})` : "";
      
      showToastinfo(`Added ${quantity} ${product?.name}${colorText} to cart`);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      showToastinfo(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Product Not Found</h2>
          <button
            onClick={() => navigate("/e-shop")}
            className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-8 mx-auto max-w-7xl sm:px-8 xl:px-10">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <button onClick={() => navigate("/")} className="hover:text-blue-600">
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button onClick={() => navigate("/e-shop")} className="hover:text-blue-600">
              Shop
            </button>
          </li>
          <li>/</li>
          <li className="font-medium text-gray-800">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg aspect-square bg-gray-50">
            <img
              src={selectedImage}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            
            {product.category && (
              <p className="mb-4 text-sm text-blue-600">
                {product.category.name}
              </p>
            )}

            <div className="flex items-center mb-6 space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                LKR {product.price.toLocaleString()}
              </span>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                (product.stock ?? 0) > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {(product.stock ?? 0) > 0 
                  ? `${product.stock} in stock` 
                  : 'Out of stock'}
              </div>
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p className="leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>
          )}

          {/* Available Colors - UPDATED SECTION */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Available Colors *
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {product.colors.map((productColor: any) => (
                  <label
                    key={productColor.color.id}
                    className={`flex items-center p-3 space-x-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedColorId === productColor.color.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={productColor.color.id}
                      checked={selectedColorId === productColor.color.id}
                      onChange={(e) => setSelectedColorId(parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div
                      className="flex-shrink-0 w-6 h-6 border border-gray-300 rounded-full"
                      style={{ backgroundColor: productColor.color.hexCode }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {productColor.color.name}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">* Color selection is required</p>
            </div>
          )}

          {/* Product Specifications */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.volume && (
                <div>
                  <span className="font-medium text-gray-900">Volume:</span>
                  <span className="ml-2 text-gray-600">{product.volume}L</span>
                </div>
              )}
              {product.finish && (
                <div>
                  <span className="font-medium text-gray-900">Finish:</span>
                  <span className="ml-2 text-gray-600">{product.finish}</span>
                </div>
              )}
              {product.coverage && (
                <div>
                  <span className="font-medium text-gray-900">Coverage:</span>
                  <span className="ml-2 text-gray-600">{product.coverage}</span>
                </div>
              )}
              {product.dryingTime && (
                <div>
                  <span className="font-medium text-gray-900">Drying Time:</span>
                  <span className="ml-2 text-gray-600">{product.dryingTime}</span>
                </div>
              )}
              {product.coats && (
                <div>
                  <span className="font-medium text-gray-900">Coats:</span>
                  <span className="ml-2 text-gray-600">{product.coats}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="font-medium text-gray-900">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 transition hover:text-gray-800"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 1, parseInt(e.target.value) || 1)))}
                  className="w-16 px-3 py-2 text-center border-gray-300 border-x focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                  className="px-3 py-2 text-gray-600 transition hover:text-gray-800"
                  disabled={quantity >= (product.stock || 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={(product.stock ?? 0) === 0}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  (product.stock ?? 0) > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {(product.stock ?? 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button className="px-6 py-3 text-gray-700 transition border-2 border-gray-300 rounded-lg hover:border-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="pt-6 border-t">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Customer Reviews ({product.reviews.length})
              </h3>
              <div className="space-y-4">
                {product.reviews.slice(0, 3).map((review: any) => (
                  <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {review.user.name}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
                
                {product.reviews.length > 3 && (
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View all {product.reviews.length} reviews
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back to Shop Button */}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate("/e-shop")}
          className="px-8 py-3 font-medium text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          ← Back to Shop
        </button>
      </div>
    </div>
  );
}