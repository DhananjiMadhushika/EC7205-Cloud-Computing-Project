import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "@/types/CartTypes";
import { Product } from "@/types/ProductType";
import { showToastError } from "@/utils/toast/errToast";
import { showToastSuccess } from "@/utils/toast/successToast";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { QuantityPopup } from "../Eshop/QuantityPopup";
import { AccountPopup } from "./AccountPopup";
import { OrderConfirmationModal } from "./OrderConfirmation";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [addAddress, setAddAddress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  const [isOpen, setIsopen] = useState(false);
  const [selectedCartItemId, setSelectedCartItemId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      showToastError("Please log in to view your cart");
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: token,
        },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const handleProceedToCheckout = async () => {
    const token = sessionStorage.getItem("authToken");
    const userId = sessionStorage.getItem("userID");
    if (!token) {
      showToastError("Please log in to proceed with checkout");
      return;
    }
  
    if (cartItems.length === 0) {
      showToastError("Your cart is empty");
      return;
    }
  
    try {
      const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: token,
        },
      });
  
      const userData = userResponse.data;
      setUser(userData);
  
      const hasPhoneNumber = !!userData.phoneNumber;
      const hasFormattedAddress = userData.addresses.length > 0 && userData.addresses[0].formattedAddress;
      
      if (!hasPhoneNumber && !hasFormattedAddress) {
        setAddAddress(true);
        showToastError("Add your shipping address and phone number before checkout process");
        return;
      } else if (!hasFormattedAddress) {
        setAddAddress(true);
        showToastError("Add your shipping address before checkout process");
        return;
      } else if (!hasPhoneNumber) {
        setAddAddress(true);
        showToastError("Add your phone number before checkout process");
        return;
      }

      // Prepare order data for confirmation
      const orderConfirmationData = {
        user: userData,
        cartItems: cartItems,
        totalPrice: totalPrice,
        address: userData.addresses[0],
        items: cartItems.map((cart) => cart.product?.name).join(", ")
      };
      
      setOrderData(orderConfirmationData);
      setShowOrderConfirmation(true);
    } catch (error) {
      console.error("Failed to prepare checkout:", error);
      showToastError("Error preparing checkout");
    }
  };

 // Fixed Frontend - Cart.tsx (handleConfirmOrder function)
const handleConfirmOrder = async () => {
  if (!orderData) return;
  
  setIsProcessingOrder(true);
  const token = sessionStorage.getItem("authToken");
  
  try {
    const response = await axios.post(
      "http://localhost:5000/api/orders/create",
      {
        // Remove items, totalAmount, shippingAddress, phoneNumber
        // Backend will get these from cart and user profile
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      // Clear cart after successful order
      await clearCart();
      
      showToastSuccess("Order placed successfully!");
      setShowOrderConfirmation(false);
      setOrderData(null);
      
      // Navigate to orders page or success page
      navigate("/account");
    } else {
      showToastError("Failed to place order");
    }
  } catch (error) {
    console.error("Failed to create order:", error);
    showToastError("Error placing order. Please try again.");
  } finally {
    setIsProcessingOrder(false);
  }
};

  const clearCart = async () => {
    const token = sessionStorage.getItem("authToken");
    try {
      await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: {
          Authorization: token,
        },
      });
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }
        await axios.delete(
          `http://localhost:5000/api/cart/${productToDelete}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productToDelete)
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };
  
  const openDeleteModal = (productId: number) => {
    setProductToDelete(productId);
    setIsModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsModalOpen(false);
  };
  
  // Calculate total price of all cart items
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      Number(sum) +
      (Number(item.product?.price ?? 0) * Number(item.quantity ?? 1)),
    0
  );

  return (
    <div className="mt-20 md:mt-28">
      <div className="flex flex-col w-full px-5 mx-auto my-5 max-w-1440 sm:px-8 xl:px-10 lg:my-8">
        <h1 className="flex justify-center text-3xl font-light uppercase text-black/70 font-anton md:text-3xl xl:text-5xl">
          Shopping Cart
        </h1>
        <hr className="border-2 border-black/70 mt-1.5 md:mt-3" />

        {cartItems.length === 0 ? (
          <p className="mt-8 text-center text-gray-600">
            There are no items in your cart yet.
          </p>
        ) : (
          <div className="mt-8 lg:mt-10">
            <div className="flex flex-col p-2 shadow-xl sm:p-5 lg:p-10 rounded-2xl gap-y-6 md:gap-y-8 bg-slate-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 xl:gap-x-14 gap-y-3 sm:gap-y-5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 border-b-2 border-gray-500 sm:p-4"
                  >
                    <div className="flex items-center gap-0 sm-425:gap-5 sm:gap-8 lg:gap-5">
                      <div className="flex items-center gap-2 sm-425:gap-3">
                        <div>
                          <img
                            src={item.product?.productImage}
                            className="w-full h-20 sm:h-24 lg:h-[120px] object-contain"
                            alt={item.product?.name}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm sm-525:text-base md:text-lg font-semibold capitalize text-gray-800 w-[115px] sm-425:w-auto">
                            {item.product?.name}
                          </h3>
                          <p className="text-xs font-semibold text-gray-600 sm-525:text-sm md:text-base">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-xs font-semibold text-gray-600 sm-525:text-sm md:text-base">
                            Unit Price: Rs.{item.product?.price ?? 0}
                          </p>
                          <p className="text-xs font-semibold text-gray-600 sm-525:text-sm md:text-base">
                            Subtotal: Rs.{Number(item.product?.price ?? 0) * Number(item.quantity ?? 1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* button container */}
                    <div className="flex flex-col sm:flex-row items-center space-y-1.5 sm:space-y-0 sm:space-x-2.5">
                      <button
                        onClick={() => {
                          setSelectedCartItemId(item.id!);
                          setSelectedProduct(item.product ?? null);
                          setIsopen(true);
                        }}
                        className="flex items-center justify-center w-8 h-8 font-bold text-white bg-green-500 rounded-full hover:bg-green-600"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="flex items-center justify-center w-8 h-8 font-bold text-white bg-red-500 rounded-full hover:bg-red-600"
                        onClick={() => openDeleteModal(item.id!)}
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary and Checkout */}
              <div className="pt-4 border-t-2 border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-700">
                    Total Items: {cartItems.length}
                  </span>
                  <span className="text-xl font-bold text-gray-800">
                    Total: Rs.{totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full px-5 py-3 text-base font-semibold text-white transition bg-green-500 rounded-lg hover:bg-green-600"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        <QuantityPopup
          product={selectedProduct} 
          isOpen={isOpen}
          setIsOpen={setIsopen}
          cartItemId={selectedCartItemId} 
          onUpdateCart={fetchCartItems}
        />

        {/* Order Confirmation Modal */}
        {showOrderConfirmation && orderData && (
          <OrderConfirmationModal
            orderData={orderData}
            onConfirm={handleConfirmOrder}
            onCancel={() => {
              setShowOrderConfirmation(false);
              setOrderData(null);
            }}
            isProcessing={isProcessingOrder}
          />
        )}

        {addAddress && user && (
          <AccountPopup
            title={
              !user.phoneNumber && (!user.addresses || user.addresses.length === 0 || !user.addresses[0].formattedAddress)
                ? "Add your shipping address and phone number before checkout process"
                : !user.addresses || user.addresses.length === 0 || !user.addresses[0].formattedAddress
                ? "Add your shipping address before checkout process"
                : "Add your phone number before checkout process"
            }
            buttonLabel={
              !user.phoneNumber && (!user.addresses || user.addresses.length === 0 || !user.addresses[0].formattedAddress)
                ? "Add your Address and Phone Number"
                : !user.addresses || user.addresses.length === 0 || !user.addresses[0].formattedAddress
                ? "Add your Address"
                : "Add your Phone Number"
            }
            onclick={() => {
              setAddAddress(false);
              navigate("/account");
            }}
          />
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="p-6 bg-[#262626] rounded-xl w-[340px] sm-425:w-[380px]">
              <h2 className="text-xl font-semibold text-white">
                Confirm Deletion
              </h2>
              <p className="mt-5 text-sm text-gray-300 md:text-base">
                Are you sure you want to delete this item from the cart?
              </p>
              <div className="flex justify-end mt-5 space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-1.5 text-sm md:text-base text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-6 py-1.5 text-sm md:text-base text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}