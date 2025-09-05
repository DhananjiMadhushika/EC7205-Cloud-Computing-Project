import OrderTable from "@/components/OrderTable";
import Pagination from "@/components/Pagination";
import { Order } from "@/types/OrderTypes";
import { useEffect, useState } from "react";

const AdminOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found");
        return;
      }

      // Updated API endpoint
      const response = await fetch("http://localhost:3002/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      // Format orders based on the new data structure with proper null/undefined checks
      const formattedOrders: Order[] = result.map((order: any) => ({
        id: order._id,
        orderId: order._id,
        name: order.customerDetails?.name || "N/A",
        address: order.address || "N/A",
        
        orderedProducts: order.products?.map((p: any) => {
          const colorInfo = p.color ? ` (${p.color.name})` : "";
          return `${p.name}${colorInfo} (x${p.quantity})`;
        }).join(", ") ?? "N/A",
        date: new Date(order.createdAt).toLocaleDateString(),
        status: order.status,
        netAmount: order.netAmount,
        phoneNumber: order.customerDetails?.phoneNumber || "N/A",
        subtotalAmount: order.subtotalAmount,
        discountAmount: order.discountAmount,
        discountPercentage: order.discountPercentage,
        products: order.products || [],
        events: order.events || []
      }));

      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilter = () => {
    let filtered = orders;

    if (selectedStatus) {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    if (searchOrderId) {
      filtered = filtered.filter((order) => 
        order.orderId.toString().toLowerCase().includes(searchOrderId.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedStatus("");
    setSearchOrderId("");
    setFilteredOrders(orders);
    setCurrentPage(1);
  };

  // Callback function to refresh orders after status update
  const handleStatusUpdate = () => {
    fetchOrders();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex-1 p-4 md:p-6 xl:p-8 bg-[#262626] rounded-2xl">
        <h1 className="text-xl font-semibold capitalize md:text-2xl xl:text-3xl text-gray-50">
          Order Details
        </h1>

        <hr className="my-2 border-t border-gray-500 md:my-4" />

        <div className="grid gap-4 my-7 md:my-6 md:grid-cols-3 md:gap-6">
          <div className="">
            <label
              htmlFor="status"
              className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            >
              Order Status :
            </label>
            <select
              id="status"
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Select Order Status</option>
              <option value="PENDING">PENDING</option>
              <option value="PACKING">PACKING</option>
              <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
            </select>
          </div>

          <div className="">
            <label
              htmlFor="orderId"
              className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            >
              Order Id :
            </label>
            <input
              id="orderId"
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
              placeholder="Enter the order Id"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2.5 md:gap-4">
          <button
            className="px-8 py-2 text-sm font-semibold text-white transition bg-orange-800 rounded-lg md:font-bold md:text-base hover:bg-orange-900 disabled:opacity-50"
            onClick={handleFilter}
            disabled={isLoading}
          >
            Filter
          </button>
          <button
            className="px-8 py-2 text-sm font-semibold text-white transition bg-green-500 rounded-lg md:font-bold md:text-base hover:bg-green-600 disabled:opacity-50"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            className="flex items-center gap-2 px-8 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded-lg md:font-bold md:text-base hover:bg-blue-700 disabled:opacity-50"
            onClick={fetchOrders}
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            )}
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <hr className="my-6 border-t border-gray-500" />
        
        {isLoading ? (
          <div className="py-8 text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span className="text-lg">Loading Orders...</span>
            </div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <OrderTable 
            data={currentItems} 
            type="admin"
            onStatusUpdate={handleStatusUpdate}
          />
        ) : (
          <div className="py-8 text-center text-white">
            <div className="mb-2 text-lg">No Orders Found</div>
            <div className="text-sm text-gray-400">
              {orders.length === 0 ? "No orders available" : "Try adjusting your filters"}
            </div>
          </div>
        )}
        
        {filteredOrders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrder;