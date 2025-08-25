type OrderConfirmationProps = {
  orderData: {
    user: any;
    cartItems: any[];
    totalPrice: number;
    address: any;
    items: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
};

export const OrderConfirmationModal = ({ 
  orderData, 
  onConfirm, 
  onCancel, 
  isProcessing 
}: OrderConfirmationProps) => {
  const { user, cartItems, totalPrice, address } = orderData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white px-6 py-6 rounded-xl shadow-xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-6 text-xl font-bold text-center text-gray-800 md:text-2xl">
          Order Confirmation
        </h2>
        
        {/* Customer Information */}
        <div className="p-4 mb-6 rounded-lg bg-gray-50">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">Customer Information</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">Name:</p>
              <p className="font-medium text-gray-800">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone:</p>
              <p className="font-medium text-gray-800">{user.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="p-4 mb-6 rounded-lg bg-gray-50">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">Shipping Address</h3>
          <div className="text-gray-800">
            <p>{address.lineOne}</p>
            {address.lineTwo && <p>{address.lineTwo}</p>}
            <p>{address.city}, {address.country}</p>
            <p>{address.pinCode}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">Order Items</h3>
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div 
                key={item.id || index} 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
                    {item.product?.productImage ? (
                      <img
                        src={item.product.productImage}
                        alt={item.product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800 capitalize">
                      {item.product?.name || 'Product'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity || 1}
                    </p>
                    <p className="text-sm text-gray-600">
                      Unit Price: Rs.{item.product?.price || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    Rs.{((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">
              Total Items: {cartItems.length}
            </span>
            <span className="text-xl font-bold text-green-600">
              Total Amount: Rs.{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-3 mt-8 sm:flex-row">
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-8 py-3 text-white rounded-lg font-semibold transition-colors ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Confirm Order'
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              isProcessing 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};