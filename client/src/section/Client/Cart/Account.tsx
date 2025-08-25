import { showToastError } from "@/utils/toast/errToast";
import { showToastSuccess } from "@/utils/toast/successToast";
import axios from "axios";
import { useEffect, useState } from "react";

type Address = {
  id?: number;
  lineOne: string;
  lineTwo?: string;
  pinCode: string;
  country: string;
  city: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  addresses: {
    id: number;
    lineOne: string;
    lineTwo?: string;
    city: string;
    country: string;
    pinCode: string;
    formattedAddress: string;
  }[];
};

type OrderProduct = {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    productImage?: string;
  };
  review?: Review;
};

type Order = {
  id: number;
  netAmount: number;
  subtotalAmount: number;
  discountAmount: number;
  address: string;
  status: string;
  createdAt: string;
  products: OrderProduct[];
};

type Review = {
  id?: number;
  productId: number;
  orderId: number;
  rating: number;
  comment: string;
};

export default function Account() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>({
    lineOne: "",
    lineTwo: "",
    pinCode: "",
    country: "",
    city: "",
  });
  const [defaultShipping, setDefaultShipping] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviews, setReviews] = useState<{ [key: number]: Review }>({});
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchAddresses();
    fetchUserDetails();
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [addresses]);

  const fetchAddresses = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        showToastError("Please log in to view addresses");
        return;
      }
      const response = await axios.get(
        "http://localhost:5000/api/users/address",
        {
          headers: { Authorization: token },
        }
      );
      setAddresses(response.data);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        showToastError("Please log in to view user details");
        return;
      }
      const userId = sessionStorage.getItem("userID");
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: { Authorization: token },
        }
      );
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        showToastError("Please log in to view your orders");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: token },
      });

      const parsedOrders = response.data.map((order: any) => ({
        ...order,
        netAmount: parseFloat(order.netAmount) || 0,
        subtotalAmount: parseFloat(order.subtotalAmount) || 0,
        discountAmount: parseFloat(order.discountAmount) || 0,
      }));
      console.log("orders", parsedOrders);
      setOrders(parsedOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      showToastError("Failed to load your orders");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchReviewsForOrder = async (orderId: number) => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/reviews/order/${orderId}`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("reviews:", response);
      const reviewMap: { [key: number]: Review } = {};
      response.data.forEach((review: Review) => {
        reviewMap[review.productId] = review;
      });

      return reviewMap;
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      return {};
    }
  };

  const handleAddAddress = async () => {
    if (addresses.length > 0) {
      showToastError(
        "Please delete an existing address before adding a new one."
      );
      return;
    }

    if (
      !form.lineOne ||
      !form.lineTwo ||
      !form.city ||
      !form.country ||
      !form.pinCode
    ) {
      showToastError("All fields are required!");
      return;
    }

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        showToastError("Please log in to add an address");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/users/address",
        form,
        {
          headers: { Authorization: token },
        }
      );
      console.log(response);
      fetchAddresses();
      setShowPopup(true);
      setForm({ lineOne: "", lineTwo: "", city: "", country: "", pinCode: "" });
    } catch (error) {
      console.error("Failed to add address", error);
      showToastError("Failed to add address");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      const token = sessionStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/api/users/address/${id}`, {
        headers: { Authorization: token },
      });
      fetchAddresses();
      showToastSuccess("Address deleted successfully");
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  const handleSetDefault = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      await axios.put(
        "http://localhost:5000/api/users",
        {
          defaultShippingAddress: Number(defaultShipping),
        },
        {
          headers: { Authorization: token },
        }
      );
      showToastSuccess("Default address updated");
    } catch (error) {
      console.error("Failed to set default addresses", error);
    }
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleUpdatePhoneNumber = async () => {
    if (!phoneNumber) {
      setPhoneError("Phone number is required!");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError("* Phone number must be exactly 10 digits");
      return;
    }

    setPhoneError(null);

    try {
      setIsUpdatingPhone(true);
      const token = sessionStorage.getItem("authToken");
      const response = await axios.put(
        "http://localhost:5000/api/users",
        { phoneNumber },
        {
          headers: { Authorization: token },
        }
      );
      setUser(response.data);
      showToastSuccess("Phone number updated successfully");
      setPhoneNumber("");
      setIsEditingPhone(false);
    } catch (error) {
      console.error("Failed to update phone number", error);
      showToastError("Failed to update phone number");
    } finally {
      setIsUpdatingPhone(false);
    }
  };

  const openReviewModal = async (order: Order) => {
    setSelectedOrder(order);
    const existingReviews = await fetchReviewsForOrder(order.id);
    setReviews(existingReviews || {});
    setShowReviewModal(true);
  };

  const handleReviewChange = (
    productId: number,
    field: "rating" | "comment",
    value: string | number
  ) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {
          productId,
          orderId: selectedOrder?.id || 0,
          rating: 5,
          comment: "",
        }),
        [field]: value,
      },
    }));
  };

  const submitReview = async (productId: number) => {
    if (!selectedOrder) return;

    const review = reviews[productId];
    if (!review || !review.rating) {
      showToastError("Please provide a rating");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const token = sessionStorage.getItem("authToken");

      let response;
      if (review.id) {
        response = await axios.put(
          `http://localhost:5000/api/reviews/${review.id}`,
          review,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/reviews",
          review,
          { headers: { Authorization: token } }
        );
      }

      if (response && response.status >= 200 && response.status < 300) {
        showToastSuccess("Review submitted successfully");

        const updatedReviews = await fetchReviewsForOrder(selectedOrder.id);
        setReviews(updatedReviews || {});
      } else {
        showToastError(
          `Failed to submit review: Unexpected response status ${response?.status}`
        );
      }
    } catch (error: any) {
      console.error("Failed to submit review", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit review";
      showToastError(errorMessage);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedOrder(null);
    setReviews({});
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAYMENT_DONE":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PACKING":
        return "bg-purple-100 text-purple-800";
      case "OUT_FOR_DELIVERY":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REQUEST_REFUND":
        return "bg-orange-100 text-orange-800";
      case "REFUND_DONE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (value: any): string => {
    const numValue = typeof value === "number" ? value : parseFloat(value) || 0;
    return numValue.toFixed(2);
  };

  return (
    <div className="bg-gray-400 bg-opacity-10 backdrop-blur-lg min-h-screen">
      <div className="mt-16 md:mt-20">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-3xl sm:text-4xl text-center font-anton text-green-800 mb-4">
                User Profile
              </h2>
              {user ? (
                <div className="space-y-5 mt-6">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-base font-medium text-gray-800">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-base font-medium text-gray-800">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-base font-medium text-gray-800">
                      {user.addresses && user.addresses.length > 0
                        ? user.addresses[0].formattedAddress
                        : "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    {!isEditingPhone ? (
                      <div className="flex items-center">
                        <p className="text-base font-medium text-gray-800">
                          {user.phoneNumber || "Not provided"}
                        </p>
                        {user.phoneNumber && (
                          <button
                            onClick={() => {
                              setPhoneNumber(user.phoneNumber);
                              setIsEditingPhone(true);
                            }}
                            className="ml-2 text-sm text-green-500 hover:text-green-600"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setPhoneNumber(value.slice(0, 10));
                            }
                          }}
                          placeholder="Enter your phone number"
                          className="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {phoneError && (
                          <p className="text-sm text-red-500 mt-1">
                            {phoneError}
                          </p>
                        )}
                        <button
                          onClick={handleUpdatePhoneNumber}
                          disabled={isUpdatingPhone}
                          className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          {isUpdatingPhone
                            ? "Updating..."
                            : "Update Phone Number"}
                        </button>
                        <button
                          onClick={() => setIsEditingPhone(false)}
                          className="mt-2 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {!user.phoneNumber && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Add your phone number
                      </p>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setPhoneNumber(value.slice(0, 10));
                          }
                        }}
                        placeholder="Enter your phone number"
                        className="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {phoneError && (
                        <p className="text-sm text-red-500 mt-1">
                          {phoneError}
                        </p>
                      )}
                      <button
                        onClick={handleUpdatePhoneNumber}
                        disabled={isUpdatingPhone}
                        className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        {isUpdatingPhone ? "Updating..." : "Add Phone Number"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Loading user details...</p>
              )}
            </div>

            <div className="lg:col-span-3">
              {/* Order History Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Order History
                </h2>

                {isLoadingOrders ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              Order #{order.id} • {formatDate(order.createdAt)}
                            </p>
                            <p className="font-medium">
                              Rs.{formatCurrency(order.netAmount)}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0 flex items-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.replace(/_/g, " ")}
                            </span>
                            {order.status === "DELIVERED" && (
                              <button
                                onClick={() => openReviewModal(order)}
                                className="ml-3 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                              >
                                Review
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.products && order.products.length > 0 ? (
                            order.products.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center text-sm py-2 border-t border-gray-100"
                              >
                                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                  {item.product && item.product.productImage ? (
                                    <img
                                      src={item.product.productImage}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      No image
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4 flex-grow">
                                  <p className="font-medium">
                                    {item.product
                                      ? item.product.name
                                      : "Product"}
                                  </p>
                                  <p className="text-gray-600">
                                    Qty: {item.quantity || 0}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p>
                                    Rs.
                                    {formatCurrency(
                                      item.product && item.product.price
                                        ? item.product.price * item.quantity
                                        : 0
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-2 text-gray-500">
                              No products in this order
                            </div>
                          )}
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                          <p>Shipping Address: {order.address}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600">
                      You haven't placed any orders yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Add New Address Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Add New Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Line One
                    </label>
                    <input
                      value={form.lineOne}
                      onChange={(e) =>
                        setForm({ ...form, lineOne: e.target.value })
                      }
                      className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Line Two
                    </label>
                    <input
                      value={form.lineTwo || ""}
                      onChange={(e) =>
                        setForm({ ...form, lineTwo: e.target.value })
                      }
                      className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      value={form.country}
                      onChange={(e) =>
                        setForm({ ...form, country: e.target.value })
                      }
                      className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      value={form.pinCode}
                      onChange={(e) =>
                        setForm({ ...form, pinCode: e.target.value })
                      }
                      className="mt-1 p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddAddress}
                  className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Address
                </button>
              </div>

              {/* Default Address Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Default Address
                </h2>
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <p className="text-sm text-gray-600">
                          {address.lineOne}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.lineTwo}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.country}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.pinCode}
                        </p>
                        <button
                          onClick={() => handleDeleteAddress(address.id!)}
                          className="mt-2 bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    No addresses saved yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address Set Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center backdrop-blur-xl z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[280px] sm:w-[340px] md:mb-32">
              <h2 className="text-base md:text-lg font-bold mb-4 text-center">
                Set Your Address as Your Shipping Address Now!
              </h2>
              <div className="flex justify-center mt-8">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => {
                      setDefaultShipping(address.id!);
                      setShowPopup(false);
                      setSaveAddress(true);
                    }}
                    type="submit"
                    className="px-6 py-2 text-sm md:text-base text-white bg-green-500 rounded-lg hover:bg-green-600 animate-bounce"
                  >
                    Set as Shipping
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Address Popup */}
        {saveAddress && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center backdrop-blur-xl z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[280px] sm:w-[340px] md:mb-32">
              <h2 className="text-base md:text-lg font-bold mb-4 text-center">
                Save your address as Default Shipping Address
              </h2>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    handleSetDefault();
                    setSaveAddress(false);
                  }}
                  type="submit"
                  className="px-6 py-2 text-sm md:text-base text-white bg-gray-500 rounded-lg hover:bg-gray-600 animate-bounce"
                >
                  Save Default Address
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {/* Review Modal */}
        {showReviewModal && selectedOrder && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center backdrop-blur-xl z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Review Your Purchase</h2>
                <button
                  onClick={closeReviewModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Order #{selectedOrder.id} •{" "}
                {formatDate(selectedOrder.createdAt)}
              </p>

              <div className="space-y-6">
                {selectedOrder.products && selectedOrder.products.length > 0 ? (
                  selectedOrder.products.map((item) => {
                    const review = reviews[item.productId] || {
                      productId: item.productId,
                      orderId: selectedOrder.id,
                      rating: 5,
                      comment: "",
                    };

                    return (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                            {item.product.productImage ? (
                              <img
                                src={item.product.productImage}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex-grow">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="font-medium mb-2">Your Rating</p>
                          <div className="flex items-center mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() =>
                                  handleReviewChange(
                                    item.productId,
                                    "rating",
                                    star
                                  )
                                }
                                className="text-2xl mr-1 focus:outline-none"
                              >
                                {star <= review.rating ? "★" : "☆"}
                              </button>
                            ))}
                          </div>

                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Your Review
                            </label>
                            <textarea
                              value={review.comment}
                              onChange={(e) =>
                                handleReviewChange(
                                  item.productId,
                                  "comment",
                                  e.target.value
                                )
                              }
                              placeholder="Share your thoughts about this product..."
                              className="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                              rows={3}
                            />
                          </div>

                          <button
                            onClick={() => submitReview(item.productId)}
                            disabled={isSubmittingReview}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            {review.id ? "Update Review" : "Submit Review"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-4">
                    No products found in this order.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {/* {showReviewModal && selectedOrder && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center backdrop-blur-xl z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Review Your Purchase</h2>
                <button 
                  onClick={closeReviewModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Order #{selectedOrder.id} • {formatDate(selectedOrder.createdAt)}
              </p>
              
              <div className="space-y-6">
                {selectedOrder.products.map((item) => {
                  const review = reviews[item.productId] || { 
                    productId: item.productId, 
                    orderId: selectedOrder.id,
                    rating: 5, 
                    comment: "" 
                  };
                  
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          {item.product.productImage ? (
                            <img 
                              src={item.product.productImage} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-grow">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                      <p className="font-medium mb-2">Your Rating</p>
                        <div className="flex items-center mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleReviewChange(item.productId, "rating", star)}
                              className="text-2xl mr-1 focus:outline-none"
                            >
                              {star <= review.rating ? "★" : "☆"}
                            </button>
                          ))}
                        </div>
                        
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Review
                          </label>
                          <textarea
                            value={review.comment}
                            onChange={(e) => handleReviewChange(item.productId, "comment", e.target.value)}
                            placeholder="Share your thoughts about this product..."
                            className="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows={3}
                          />
                        </div>
                        
                        <button
                          onClick={() => submitReview(item.productId)}
                          disabled={isSubmittingReview}
                          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          {review.id ? "Update Review" : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
