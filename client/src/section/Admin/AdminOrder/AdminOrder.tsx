import OrderTable from "@/components/OrderTable";
import Pagination from "@/components/Pagination";
import { Order } from "@/types/OrderTypes";
import { useEffect, useState } from "react";

const AdminOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/orders/index", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      const formattedOrders: Order[] = result.map((order: any) => ({
        id: order.id,
        orderId: order.id,
        name: order.user ? `${order.user.name ?? "N/A"} ${order.user.phoneNumber ?? ""}`.trim() : "N/A",
        address: order.address,
        branch: order.branch ? order.branch.name : "N/A",
        orderedProducts: order.products?.map((p: any) => `${p.product?.name ?? "Unknown Product"} (x${p.quantity})`).join(", ") ?? "N/A",
        date: new Date(order.createdAt).toLocaleDateString(),
        status: order.status,
        netAmount: order.netAmount,
      }));

      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const getBranches = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }

        const response = await fetch("http://localhost:5000/api/branch/", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();

        const formattedBranches = result.map((branch: any) => ({
          id: branch.id,
          name: branch.name,
        }));

        setBranches(formattedBranches);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    getBranches();
  }, []);

  const handleFilter = () => {
    let filtered = orders;

    if (selectedBranch) {
      filtered = filtered.filter((order) => order.branch === selectedBranch);
    }

    if (selectedStatus) {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    if (searchOrderId) {
      filtered = filtered.filter((order) => order.orderId.toString().includes(searchOrderId));
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedBranch("");
    setSelectedStatus("");
    setSearchOrderId("");
    setFilteredOrders(orders);
    setCurrentPage(1);
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
          <div>
            <label className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white">
              Branch :
            </label>
            <select
              id="volume"
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="">
            <label
              htmlFor="price"
              className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            >
              Order Status :
            </label>
            <select
              id="price"
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Select Order Status</option>
              <option value="PAYMENT_DONE">PAYMENT_DONE</option>
              <option value="PENDING">PENDING</option>
              <option value="PACKING">PACKING</option>
              <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="REQUEST_REFUND">REQUEST_REFUND</option>
              <option value="REFUND_DONE">REFUND_DONE</option>
            </select>
          </div>

          <div className="">
            <label
              htmlFor="quantity"
              className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            >
              Order Id :
            </label>
            <input
              id="quantity"
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
              placeholder="Enter the order Id"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2.5 md:gap-4">
          <button
            className="px-8 py-2 text-sm font-semibold text-white transition bg-orange-800 rounded-lg md:font-bold md:text-base hover:bg-orange-900"
            onClick={handleFilter}
          >
            Filter
          </button>
          <button
            className="px-8 py-2 text-sm font-semibold text-white transition bg-green-500 rounded-lg md:font-bold md:text-base hover:bg-green-600"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        <hr className="my-6 border-t border-gray-500" />
        
        {filteredOrders.length > 0 ? (
          <OrderTable 
            data={currentItems} 
            type ="admin"
          />
        ) : (
          <div className="py-4 text-center text-white">No Orders Found</div>
        )}
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminOrder;