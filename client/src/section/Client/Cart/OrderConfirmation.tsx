interface OrderConfirmationModalProps {
  orderData: any;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export function OrderConfirmationModal({ orderData, onConfirm, onCancel, isProcessing }: OrderConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="p-6 bg-white rounded-xl w-[500px] max-w-full max-h-[90vh] overflow-y-auto">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Confirm Your Order
        </h2>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Order Items ({orderData.cartItems.length})
          </h3>
          <div className="space-y-3 overflow-y-auto max-h-40">
            {orderData.cartItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.product?.productImage}
                    alt={item.product?.name}
                    className="object-cover w-12 h-12 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.product?.name}</p>
                    {item.color && (
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-3 h-3 border border-gray-300 rounded-full"
                          style={{ backgroundColor: item.color.hexCode }}
                        ></div>
                        <span className="text-xs text-gray-600">{item.color.name}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    Rs.{(item.product?.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            Shipping Details
          </h3>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Name:</span> {orderData.user.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {orderData.user.email}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Phone:</span> {orderData.user.phoneNumber}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Address:</span> {orderData.address.formattedAddress}
            </p>
          </div>
        </div>

        {/* Order Total */}
        <div className="p-4 mb-6 rounded-lg bg-blue-50">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">
              Total Amount:
            </span>
            <span className="text-2xl font-bold text-blue-600">
              Rs.{orderData.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-2 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
}