import { Order } from "@/types/OrderTypes";
import { useState } from "react";

interface Columns {
  header: string;
  accessor: string;
  className: string;
}

interface OrderProps {
  data: Order[];
  type: string;
  onStatusUpdate?: () => void; // Add callback for refreshing data
}

const tableHeader: Columns[] = [
  { header: "", accessor: "id", className: " text-red " },
  {
    header: " OrderId",
    accessor: "orderId",
    className: " text-red px-0 text-xs md:text-sm",
  },
  {
    header: "Customer Details",
    accessor: "name",
    className: " text-red text-xs md:text-sm",
  },
  {
    header: "Address",
    accessor: "address",
    className: " text-red text-xs md:text-sm",
  },
  {
    header: "Ordered Products",
    accessor: "orderedProducts",
    className: "text-xs md:text-sm",
  },
  {
    header: "Date",
    accessor: "date",
    className: "text-xs md:text-sm",
  },
  { header: "Order Status", accessor: "status", className: "text-xs md:text-sm" },
  { header: "Paid Amount", accessor: "amount", className: "text-xs md:text-sm" },
];

const OrderTable = ({ data, type, onStatusUpdate }: OrderProps) => {
  const [statusUpdates, setStatusUpdates] = useState<Record<number, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const openModal = (orderId: number, currentStatus: string) => {
    setSelectedOrderId(orderId);
    setNewStatus(currentStatus);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setIsUpdating(false);
  };

  const handleStatusChange = async () => {
    if (!selectedOrderId) return;
    
    setIsUpdating(true);
    
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
      }

      // Updated to use the correct port and endpoint
      const response = await fetch(`http://localhost:3002/orders/${selectedOrderId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Fixed: Added Bearer prefix
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update status: ${response.status}`);
      }

      
      
      // Update local state
      setStatusUpdates((prev) => ({ ...prev, [selectedOrderId]: newStatus }));
      
      // Call callback to refresh data if provided
      if (onStatusUpdate) {
        onStatusUpdate();
      }
      
      alert("Order status updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error instanceof Error ? error.message : "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusOptions = (userType: string) => {
    switch (userType) {
      case "admin":
        return [
          "PENDING",
          "PACKING", 
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED"
        ];
      case "agent":
        return [
          "PENDING",
          "PACKING",
          "OUT_FOR_DELIVERY"
        ];
      case "rep":
        return [
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED"
        ];
      default:
        return ["PENDING", "PACKING", "OUT_FOR_DELIVERY", "DELIVERED"];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-400";
      case "PACKING":
        return "text-blue-400";
      case "OUT_FOR_DELIVERY":
        return "text-orange-400";
      case "DELIVERED":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <table className="w-full mt-4 bg-gray-800 min-w-max">
        <thead className="text-white bg-gray-900">
          <tr className="h-10 text-sm text-left">
            {tableHeader.map((col) => (
              <th key={col.accessor} className={`${col.className} px-4 py-2`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="text-sm text-black border-b border-gray-200 even:bg-[#262626] even:text-white bg-slate-500"
            >
              <td className="flex items-center gap-2 pt-6 pb-6 text-xs md:text-sm"></td>
              <td className="px-3 py-2 text-xs md:text-sm">{item.orderId}</td>
              <td className="px-4 py-2 text-xs md:text-sm">
                <div className="flex flex-col">
                  <span>{item.name.split(" ")[0]}</span>
                  <span>{item.name.split(" ")[1]}</span>
                  <span>{item.phoneNumber}</span>
                </div>
              </td>
              <td className="px-4 py-2 text-xs md:text-sm">
                <div className="grid gap-1 grid-row-2">
                  <span>
                    {item.address
                      .split(" ")
                      .slice(0, Math.ceil(item.address.split(" ").length / 2))
                      .join(" ")}
                  </span>
                  <span>
                    {item.address
                      .split(" ")
                      .slice(Math.ceil(item.address.split(" ").length / 2))
                      .join(" ")}
                  </span>
                </div>
              </td>
              <td>
                <ul className="px-4 py-2 text-xs md:text-sm">
                  {item.orderedProducts.split(", ").map((product: string, index: number) => (
                    <li key={index}>{product}</li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-2 text-xs md:text-sm">{item.date}</td>
              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className={`font-semibold ${getStatusColor(statusUpdates[item.id] || item.status)}`}>
                    {statusUpdates[item.id] || item.status}
                  </span>
                  <button
                    onClick={() => openModal(item.id, statusUpdates[item.id] || item.status)}
                    className="p-1 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                    aria-label="Edit status"
                    title="Update order status"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                    </svg>
                  </button>
                </div>
              </td>
              <td className="px-4 py-2 text-xs md:text-sm">Rs.{item.netAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Status Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-md p-6 mx-4 bg-gray-800 rounded-lg w-96">
            <h3 className="mb-4 text-xl font-medium text-white">Update Order Status</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-white">
                Order ID: <span className="font-bold text-blue-400">{selectedOrderId}</span>
              </label>
              <label className="block mb-2 text-sm font-medium text-white">
                Current Status: <span className={`font-bold ${getStatusColor(statusUpdates[selectedOrderId as number] || '')}`}>
                  {statusUpdates[selectedOrderId as number] || data.find(item => item.id === selectedOrderId)?.status}
                </span>
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2.5 bg-black border-black text-white text-sm rounded-lg focus:outline-none focus:border focus:border-green-600"
                disabled={isUpdating}
              >
                {getStatusOptions(type).map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                disabled={isUpdating}
                className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                )}
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;