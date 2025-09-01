import { showToastinfo } from "@/utils/toast/infoToast";
import { showToastSuccess } from "@/utils/toast/successToast";
import { showToastError } from "@/utils/toast/errToast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<any | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.productImage);
        
        if (response.data.colors && response.data.colors.length > 0) {
          setSelectedColor(response.data.colors[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        showToastError("Product not found");
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
      showToastError("Please log in first to add items to cart.");
      return;
    }

    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      showToastError("Please select a color before adding to cart.");
      return;
    }

    if (quantity > (product?.stock || 0)) {
      showToastError("Selected quantity exceeds available stock.");
      return;
    }
    
    setAddingToCart(true);
    try {
      const cartData = {
        productId: product._id,
        quantity: quantity,
        color: selectedColor ? {
          colorId: selectedColor._id,
          name: selectedColor.name,
          hexCode: selectedColor.hexCode
        } : null
      };

      const response = await axios.post(
        "http://localhost:3002/cart",
        cartData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        const colorText = selectedColor ? ` (${selectedColor.name})` : "";
        showToastSuccess(`Added ${quantity} ${product?.name}${colorText} to cart`);
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      
      if (error.response?.status === 401) {
        showToastError("Please log in again to add items to cart");
        navigate("/");
      } else if (error.response?.status === 400) {
        showToastError(error.response.data.message || "Invalid request");
      } else {
        showToastError(error.response?.data?.message || "Failed to add item to cart");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      showToastError("Please log in first to make a purchase.");
      return;
    }

    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      showToastError("Please select a color before purchasing.");
      return;
    }

    if (quantity > (product?.stock || 0)) {
      showToastError("Selected quantity exceeds available stock.");
      return;
    }

    // Add to cart first, then navigate to cart for checkout
    await handleAddToCart();
    if (!addingToCart) {
      navigate("/cart");
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

          {/* Available Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Available Colors *
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {product.colors.map((color: any) => (
                  <label
                    key={color._id}
                    className={`flex items-center p-3 space-x-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedColor?._id === color._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={color._id}
                      checked={selectedColor?._id === color._id}
                      onChange={() => setSelectedColor(color)}
                      className="sr-only"
                    />
                    <div
                      className="flex-shrink-0 w-6 h-6 border border-gray-300 rounded-full"
                      style={{ backgroundColor: color.hexCode }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {color.name}
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
                disabled={(product.stock ?? 0) === 0 || addingToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  (product.stock ?? 0) > 0 && !addingToCart
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {addingToCart ? 'Adding...' : (product.stock ?? 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={(product.stock ?? 0) === 0 || addingToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  (product.stock ?? 0) > 0 && !addingToCart
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {addingToCart ? 'Processing...' : (product.stock ?? 0) > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>
              
              <button className="px-6 py-3 text-gray-700 transition border-2 border-gray-300 rounded-lg hover:border-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
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
      </div>
    </div>
  );
}