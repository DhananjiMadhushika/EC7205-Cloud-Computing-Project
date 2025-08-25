import { Product } from "@/types/ProductType";
import { showToastError } from "@/utils/toast/errToast";
import { showToastSuccess } from "@/utils/toast/successToast";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

type QuantityPopupProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  product: Product | null;
  cartItemId?: number | null; 
  onUpdateCart?: () => void;
};

export const QuantityPopup: React.FC<QuantityPopupProps> = ({
  isOpen,
  setIsOpen,
  product,
  cartItemId,
  onUpdateCart,
}) => {
  const [isScrollDown, setIsScrollDown] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleAddToCart = async (productId: any, quantity: any) => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        showToastError("Please log in to add items to the cart");
        return;
      }

      // Check if quantity exceeds available stock
      if (product && quantity > (product.adminStock ?? 0)) {
        showToastError(`Only ${product.adminStock} items available in stock`);
        return;
      }

      if (cartItemId) {
        // Update existing cart item
        const response = await axios.put(
          `http://localhost:5000/api/cart/${cartItemId}`,
          { quantity: Number(quantity) },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("Product updated!", response);
        showToastSuccess("Cart updated successfully!");
      } else {
        // Add new item to cart
        const response = await axios.post(
          "http://localhost:5000/api/cart",
          {
            productId: Number(productId),
            quantity: Number(quantity),
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("Product added to cart!", response);
        showToastSuccess("Product added to cart!");
      }
      
      setIsOpen(false);
      if (onUpdateCart) {
        onUpdateCart();
      }
      navigate("/cart");
    } catch (error: any) {
      console.error("Error updating cart:", error);
      const errorMessage = error.response?.data?.message || "Failed to update cart. Please try again.";
      showToastError(errorMessage);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(newQuantity);
  };

  const handleScroll = () => {
    setIsScrollDown((prev) => !prev);
    setIsOpen(false);
  };

  // Reset quantity when popup opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const maxQuantity = product.adminStock ?? 0;
  const isOutOfStock = maxQuantity === 0;
  const isLargeOrder = quantity > 100;

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
        <div
          className={`fixed backdrop-blur-[117px] left-[50%] top-[60%] sm-425:top-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-[486px] sm-425:w-[340px] sm-525:w-[400px] sm-425:h-[475px] sm-525:h-[540px] sm-425:rounded-[40px] rounded-t-[40px] bg-[#262626] transform ${
            isScrollDown ? "translate-y-0" : ""
          } transition-transform duration-500 ease-in-out`}
        >
          {/* horizontal bar */}
          <button
            className={`flex sm-425:hidden justify-center w-full mt-4 mb-6`}
            onClick={handleScroll}
          >
            <hr className="flex h-[3px] w-[79px] bg-white/70 border-none"></hr>
          </button>

          {/* close icon */}
          <div className="justify-end hidden pr-6 mt-6 cursor-pointer sm-425:flex sm:pr-7">
            <CgClose size={18} color="white" onClick={() => setIsOpen(false)} />
          </div>

          <div className="flex flex-col items-center pb-5 mx-8">
            {/* title */}
            <h1 className="flex mb-4 text-xl font-bold text-center text-white capitalize sm:text-2xl">
              {product.name}
            </h1>

            {/* image container */}
            <div className="flex border border-gray-300 p-3 sm-525:p-4 rounded-xl bg-[#5e606367]/50">
              <div className="flex w-[200px] h-[185px] sm-525:h-56">
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="object-contain w-full h-auto"
                />
              </div>
            </div>

            {/* Stock status */}
            <div className="mt-3 text-center">
              <p className={`text-sm font-medium ${
                maxQuantity > 0 ? "text-green-400" : "text-red-400"
              }`}>
                {maxQuantity > 0 ? `${maxQuantity} items in stock` : "Out of Stock"}
              </p>
              <p className="mt-1 text-sm text-white/70">
                Price: {product.price} LKR
              </p>
            </div>

            {/* enter quantity field */}
            {!isOutOfStock && (
              <div className="flex flex-col w-9/12 gap-2 mt-5">
                <label className="block text-sm font-medium text-nowrap md:text-base text-white/70">
                  Enter Quantity:
                </label>

                <input
                  type="number"
                  className="w-full py-1 px-2 border lg:border-2 border-black/70 rounded-[8px] focus:outline-none"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  max={maxQuantity}
                />
                
                {quantity > maxQuantity && (
                  <p className="mt-1 text-xs text-red-400">
                    Maximum available: {maxQuantity}
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6">
              {isOutOfStock ? (
                <div className="text-center">
                  <p className="mb-3 text-red-400">This item is currently out of stock</p>
                  <a
                    href="tel:+94xxxxxxxxx" // Replace with your store contact number
                    className="flex items-center gap-2 px-5 py-2 text-base text-white capitalize border-2 border-gray-300 rounded-full hover:border-green-500 hover:bg-green-500 hover:text-white hover:font-semibold"
                  >
                    <img src="/client/product/call3.png" alt="Call" className="w-5 h-5 sm:w-6 sm:h-6" />
                    Contact Store
                  </a>
                </div>
              ) : isLargeOrder ? (
                <a
                  href="tel:+94xxxxxxxxx" // Replace with your store contact number
                  className="flex items-center gap-2 px-5 py-2 text-base text-white capitalize border-2 border-gray-300 rounded-full hover:border-green-500 hover:bg-green-500 hover:text-white hover:font-semibold"
                >
                  <img src="/client/product/call3.png" alt="Call" className="w-5 h-5 sm:w-6 sm:h-6" />
                  Contact for Bulk Order
                </a>
              ) : (
                <button
                  className="px-8 py-2 text-base text-white capitalize border-2 border-gray-300 rounded-full hover:border-green-500 hover:bg-green-500 hover:text-white hover:font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleAddToCart(product.id, quantity)}
                  disabled={quantity > maxQuantity || quantity < 1}
                >
                  {cartItemId ? "Update Cart" : "Add to Cart"}
                </button>
              )}
            </div>

            {/* Additional product info */}
            <div className="mt-4 text-center">
              <p className="text-xs text-white/60">
                Total: {(parseFloat((product.price ?? 0).toString()) * quantity).toFixed(2)} LKR
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};