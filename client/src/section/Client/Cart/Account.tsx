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
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
};

type Order = {
  id: string;
  netAmount: number;
  subtotalAmount: number;
  discountAmount: number;
  address: string;
  status: string;
  createdAt: string;
  products: OrderProduct[];
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
        "http://localhost:3000/users/address",
        {
          headers: { Authorization: `Bearer ${token}` },
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
        `http://localhost:3000/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
      const response = await axios.get("http://localhost:3002/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Transform the API response to match frontend expectations
      const parsedOrders = response.data.map((order: any) => ({
        ...order,
        id: order._id, // Convert _id to id
        netAmount: parseFloat(order.netAmount) || 0,
        subtotalAmount: parseFloat(order.subtotalAmount) || 0,
        discountAmount: parseFloat(order.discountAmount) || 0,
        products: order.products.map((product: any) => ({
          id: product._id, // Convert _id to id
          productId: product.productId,
          quantity: product.quantity,
          product: {
            id: product.productId,
            name: product.name,
            price: product.price,
            image: product.image
          }
        }))
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
        "http://localhost:3000/users/address",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
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
      await axios.delete(`http://localhost:3000/users/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
        "http://localhost:3000/users",
        {
          defaultShippingAddress: Number(defaultShipping),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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
        "http://localhost:3000/users",
        { phoneNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
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
    <div className="min-h-screen bg-gray-400 bg-opacity-10 backdrop-blur-lg">
      <div className="mt-16 md:mt-20">
        <div className="container p-4 mx-auto lg:p-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-1">
              <h2 className="mb-4 text-3xl text-center text-green-800 sm:text-4xl font-anton">
                User Profile
              </h2>
              {user ? (
                <div className="mt-6 space-y-5">
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
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {phoneError && (
                          <p className="mt-1 text-sm text-red-500">
                            {phoneError}
                          </p>
                        )}
                        <button
                          onClick={handleUpdatePhoneNumber}
                          disabled={isUpdatingPhone}
                          className="w-full py-2 mt-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                        >
                          {isUpdatingPhone
                            ? "Updating..."
                            : "Update Phone Number"}
                        </button>
                        <button
                          onClick={() => setIsEditingPhone(false)}
                          className="w-full py-2 mt-2 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {!user.phoneNumber && (
                    <div>
                      <p className="mb-2 text-sm text-gray-600">
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
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {phoneError && (
                        <p className="mt-1 text-sm text-red-500">
                          {phoneError}
                        </p>
                      )}
                      <button
                        onClick={handleUpdatePhoneNumber}
                        disabled={isUpdatingPhone}
                        className="w-full py-2 mt-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
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
              <div className="p-6 mb-4 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  Order History
                </h2>

                {isLoadingOrders ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-b-2 border-green-500 rounded-full animate-spin"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex flex-col items-start justify-between mb-3 md:flex-row md:items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              Order #{order.id} • {formatDate(order.createdAt)}
                            </p>
                            <p className="font-medium">
                              Rs.{formatCurrency(order.netAmount)}
                            </p>
                          </div>
                          <div className="flex items-center mt-2 md:mt-0">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.products && order.products.length > 0 ? (
                            order.products.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center py-2 text-sm border-t border-gray-100"
                              >
                                <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-md">
                                  {item.product && item.product.image ? (
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                                      No image
                                    </div>
                                  )}
                                </div>
                                <div className="flex-grow ml-4">
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
                            <div className="py-2 text-center text-gray-500">
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
                  <div className="py-6 text-center">
                    <p className="text-gray-600">
                      You haven't placed any orders yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Add New Address Section */}
              <div className="p-6 mb-4 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  Add New Address
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Line One
                    </label>
                    <input
                      value={form.lineOne}
                      onChange={(e) =>
                        setForm({ ...form, lineOne: e.target.value })
                      }
                      className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddAddress}
                  className="w-full py-2 mt-6 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                >
                  Add Address
                </button>
              </div>

              {/* Default Address Section */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
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
                          className="px-4 py-1 mt-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-xl">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[280px] sm:w-[340px] md:mb-32">
              <h2 className="mb-4 text-base font-bold text-center md:text-lg">
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
                    className="px-6 py-2 text-sm text-white bg-green-500 rounded-lg md:text-base hover:bg-green-600 animate-bounce"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-xl">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[280px] sm:w-[340px] md:mb-32">
              <h2 className="mb-4 text-base font-bold text-center md:text-lg">
                Save your address as Default Shipping Address
              </h2>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    handleSetDefault();
                    setSaveAddress(false);
                  }}
                  type="submit"
                  className="px-6 py-2 text-sm text-white bg-gray-500 rounded-lg md:text-base hover:bg-gray-600 animate-bounce"
                >
                  Save Default Address
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}