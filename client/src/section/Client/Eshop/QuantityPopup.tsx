import React, { useState, useEffect } from 'react';
import { Product } from "@/types/ProductType";
import { showToastError } from "@/utils/toast/errToast";
import { showToastSuccess } from "@/utils/toast/successToast";
import axios from "axios";

interface QuantityPopupProps {
  product: Product | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  cartItemId: string | null;
  onUpdateCart: () => void;
}

export function QuantityPopup({ product, isOpen, setIsOpen, cartItemId, onUpdateCart }: QuantityPopupProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const handleUpdate = async () => {
    if (!cartItemId) return;
    
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      showToastError("Please select a color");
      return;
    }

    setUpdating(true);
    const token = sessionStorage.getItem("authToken");
    
    try {
      const updateData: any = { quantity };
      
      if (selectedColor) {
        updateData.color = {
          colorId: selectedColor._id,
          name: selectedColor.name,
          hexCode: selectedColor.hexCode
        };
      }

      await axios.put(
        `http://localhost:3002/cart/${cartItemId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showToastSuccess("Cart item updated successfully");
      onUpdateCart();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update cart item:", error);
      showToastError("Failed to update cart item");
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="p-6 bg-white rounded-xl w-[400px] max-w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Update {product.name}
        </h2>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Select Color
            </h3>
            <div className="grid grid-cols-1 gap-2">
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
                    className="flex-shrink-0 w-5 h-5 border border-gray-300 rounded-full"
                    style={{ backgroundColor: color.hexCode }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {color.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Quantity
          </h3>
          <div className="flex items-center border border-gray-300 rounded-lg w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-gray-600 transition hover:text-gray-800"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              updating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {updating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}