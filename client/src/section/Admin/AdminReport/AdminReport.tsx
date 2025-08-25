import { Branch } from "@/types/BranchTypes";
import { Order } from "@/types/OrderTypes";
import { Product } from "@/types/ProductType";
import { User } from "@/types/UserTypes";

import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from "axios";
import { Download} from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DownloadReport from "./DownloadReport";

import ReportTable from "@/components/ReportTable";

const AdminReport = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [reps, setReps] = useState<User[]>([]);
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isGenerate, setIsGenerate] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [salesType, setSalesType] = useState("");

  const [selectedBranchId, setSelectedBranchId] = useState<number>(0);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("");
  const [selectedAgentId, setSelectedAgentId] = useState<number>(0);
  const [selectedRepId, setSelectedRepId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const [totalSalesRevenue, setTotalSalesRevenue] = useState(0);
  const [totalNumberOfOrders, setTotalNumberOfOrders] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  
  const [selectedBranchName, setSelectedBranchName] = useState<string>("");
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [selectedRepName, setSelectedRepName] = useState<string>("");
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }
        const apiUrl = "http://localhost:5000/api/orders/index";

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const result = await response.json();
          const formattedOrders = result.map((order: any) => ({
            id: order.id,
            orderId: order.id,
            name: order.user ? `${order.user.name ?? "N/A"} ${order.user.phoneNumber ?? ""}`.trim() : "N/A",
            address: order.address ?? "N/A",
            branchId: order.branchId ?? "N/A",
            branch: order.branch.name ?? "N/A",
            orderedProducts: order.products?.map((p: any) => `${p.product?.name ?? "Unknown Product"} (x${p.quantity})`).join(", ") ?? "N/A",
            date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A",
            status: order.status ?? "N/A",
            netAmount: order.netAmount ?? "0.00",
            discountAmount: order.discountAmount,
            agentId:order.branch.agent?.id ?? "N/A",
            repId:order.branch.salesRep?.id ?? "N/A",
          }));

          setOrders(formattedOrders);
          setFilteredOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchBranches = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }

        const response = await fetch("http://localhost:5000/api/branch", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        const result: Branch[] = await response.json();
        setBranches(result);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    const fetchProducts = async ()=>{

      try {
        const response = await axios.get("http://localhost:5000/api/products");
        console.log(response);
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
      
    }
    const fetchAgents = async ()=>{
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }
        
        const response = await axios.get("http://localhost:5000/api/users/agent",
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        
        setAgents(response.data);
      } catch (error) {
        console.error("Failed to fetch Agents", error);
      }
    }
    const fetchRep = async ()=>{
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }
        
        const response = await axios.get("http://localhost:5000/api/users/rep",
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        
        setReps(response.data);
      } catch (error) {
        console.error("Failed to fetch Agents", error);
      }
    }

    fetchOrders();
    fetchBranches();
    fetchProducts();
   fetchAgents();
    fetchRep();
  }, []);

  const handleGenerateReport = () => {
 
    
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.date);
      
      const isWithinDateRange =
        (!startDate || orderDate >= new Date(startDate)) &&
        (!endDate || orderDate <= new Date(endDate));

      const isBranchMatch =
        !selectedBranchId || Number(order.branchId) === Number(selectedBranchId);

      const isProductMatch =
        !selectedProductId || order.orderedProducts.includes(products.find(p => p.id === selectedProductId)?.name || "N/A");

      const isStatusMatch =
        !selectedOrderStatus || order.status === selectedOrderStatus;

      const isAgentMatch =
        !selectedAgentId || order.agentId === selectedAgentId;

      const isRepMatch =
        !selectedRepId || order.repId === selectedRepId;

      return isWithinDateRange && isBranchMatch && isProductMatch && isStatusMatch && isAgentMatch && isRepMatch ;
    });

    if(filtered){
      setFilteredOrders(filtered);

    const totalSalesRev = filtered.reduce((total, order) => {
      const amount = parseFloat(order.netAmount) || 0;
      console.log(`Order ID: ${order.id}, netAmount: ${order.netAmount}, Parsed Amount: ${amount}`);
      return total + amount;
    }, 0);
    
    setTotalSalesRevenue(totalSalesRev);

    const totalDiscount = filtered.reduce((total, order) => {
      const discount = parseFloat(order.discountAmount) || 0;
      return total + discount;
    }, 0);
    setTotalDiscount(totalDiscount);

const totalN0OfOrders = filtered.length;
setTotalNumberOfOrders(totalN0OfOrders);

const totalItemsSold = filtered.reduce((total, order) => {
  const itemsInOrder = order.orderedProducts
    .split(", ")
    .reduce((sum: number, item: string) => {
      const quantityMatch = item.match(/\(x(\d+)\)/);
      return sum + (quantityMatch ? parseInt(quantityMatch[1], 10) : 0);
    }, 0);
  return total + itemsInOrder;
}, 0);

setTotalItemsSold(totalItemsSold);

setShowGenerateButton(false);
    setIsGenerate(filtered.length > 0);
    setCurrentPage(1);
    }

    
  };

  useEffect(() => {
    const selectedBranch = branches.find(branch => branch.id === selectedBranchId);
    setSelectedBranchName(selectedBranch?.name || "All Branch");
  
    const selectedProduct = products.find(product => product.id === selectedProductId);
    setSelectedProductName(selectedProduct?.name || "All Product");
  
    const selectedAgent = agents.find(agent => agent.id === selectedAgentId);
    setSelectedAgentName(selectedAgent?.name || "All Agent");
  
    const selectedRep = reps.find(rep => rep.id === selectedRepId);
    setSelectedRepName(selectedRep?.name || "All Sale Reps");
  
  }, [selectedBranchId, selectedProductId, selectedAgentId, selectedRepId, branches, products, agents, reps]);
  
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedBranchId(0);
    setSelectedProductId(0);
    setSelectedOrderStatus("");
   setSelectedAgentId(0);
    setSelectedRepId(0);
    setFilteredOrders(orders);
    setIsGenerate(false);
    setShowGenerateButton(true);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex-1 p-4 md:p-6 xl:p-8 bg-[#262626] rounded-2xl">
      <hr className="my-2 border-t border-gray-500 md:my-4" />

      <div className="flex flex-col my-2 border-gray-500 md:my-4">
        <div className="flex flex-col justify-start gap-4 md:flex-row">
          <div className="flex justify-start gap-4">
             <select
              id="sale_type"
              value={salesType}
              onChange={(e) => setSalesType(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg  py-2.5 px-8 focus:outline-none focus:border focus:border-green-600 "
            >
              <option value="">Select Date</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="range">Date Range</option>
            </select>
          </div>
          {salesType === "daily" && (
  <div className="flex justify-start gap-4">
   
    <DatePicker
      selected={startDate}
      onChange={(date: Date | null) => {
        setStartDate(date);
        setEndDate(date);
      }}
      className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
      placeholderText="Select Date"
    />
  </div>
)}

{salesType === "weekly" && (
  <div className="flex justify-start gap-4">
  
    <DatePicker
      selected={startDate}
      onChange={(date: Date | null) => {
        if (date) {
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          setStartDate(startOfWeek);
          setEndDate(endOfWeek);
        } else {
          setStartDate(null);
          setEndDate(null);
        }
      }}
      showWeekNumbers
      showWeekPicker
      className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
      placeholderText="Select Week"
    />
  </div>
)}

{salesType === "monthly" && (
  <div className="flex justify-start gap-4">
 
    <DatePicker
      selected={startDate}
      onChange={(date: Date | null) => {
        if (date) {
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          setStartDate(startOfMonth);
          setEndDate(endOfMonth);
        } else {
          setStartDate(null);
          setEndDate(null);
        }
      }}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
      placeholderText="Select Month"
    />
  </div>
)}

{salesType === "yearly" && (
  <div className="flex justify-start gap-4">
 
    <DatePicker
      selected={startDate}
      onChange={(date: Date | null) => {
        if (date) {
          const startOfYear = new Date(date.getFullYear(), 0, 1);
          const endOfYear = new Date(date.getFullYear(), 11, 31);
          setStartDate(startOfYear);
          setEndDate(endOfYear);
        } else {
          setStartDate(null);
          setEndDate(null);
        }
      }}
      showYearPicker
      dateFormat="yyyy"
      className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
      placeholderText="Select Year"
    />
  </div>
)}

{salesType === "range" && (
  <div className="flex justify-start gap-4 sm:gap-8">
    <div className="flex justify-start gap-4">
     
      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
        placeholderText="Select Start Date"
      />
    </div>

    <div className="flex justify-start gap-4">
     
      <DatePicker
        selected={endDate}
        onChange={(date: Date | null) => setEndDate(date)}
        className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
        placeholderText="Select End Date"
      />
    </div>
  </div>
)}
        </div>

        <div className="grid gap-4 my-4 md:grid-cols-3 md:gap-6">
          <div className="w-full">
            <label className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white">Branch:</label>
            <select
              id="branch"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(Number(e.target.value))}
              className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white">Product:</label>
            <select
              id="branch"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
            >
              <option value="">All Products</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
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
              id="status"
              value={selectedOrderStatus}
             onChange={(e) => setSelectedOrderStatus(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
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
        </div>

        <div className="grid gap-4 my-4 md:grid-cols-3 md:gap-6">
        <div className="w-full">
            <label className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white">Agent:</label>
            <select
              id="branch"
              value={selectedAgentId}
             onChange={(e) => setSelectedAgentId(Number(e.target.value))}
              className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white">Sales Rep:</label>
            <select
              id="branch"
              value={selectedRepId}
              onChange={(e) => setSelectedRepId(Number(e.target.value))}
              className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
            >
              <option value="">All Sales Reps</option>
              {reps.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.name}
                </option>
              ))}
            </select>
          </div>

       
       </div>
        <div className="flex gap-2.5 md:gap-4">
          {showGenerateButton && <button
            onClick={handleGenerateReport}
            className="px-8 py-2 text-sm font-semibold text-white transition bg-orange-800 rounded-lg md:font-bold md:text-base hover:bg-orange-900"
          >
            Generate Report
          </button>}
          <button
            onClick={handleReset}
            className="px-8 py-2 text-sm font-semibold text-white transition bg-green-500 rounded-lg md:font-bold md:text-base hover:bg-green-600"
          >
            Reset
          </button>
        </div>
      </div>

      <hr className="my-6 border-t border-gray-500" />
      {isGenerate && filteredOrders && (
        <div className="flex justify-end gap-4">
          <PDFDownloadLink
            document={<DownloadReport
              orders={filteredOrders}
              selectedBranchName={selectedBranchName}
              selectedProductName={selectedProductName}
              selectedAgentName={selectedAgentName}
              selectedRepName = {selectedRepName}
              selectedOrderStatus={selectedOrderStatus}
              totalSalesRevenue={totalSalesRevenue}
              totalNumberOfOrders={totalNumberOfOrders}
              totalItemsSold={totalItemsSold}
              totalDiscountsApplied={totalDiscount}
              startDate={startDate }
  endDate={endDate} 
          />}
            fileName="SalesReport.pdf"
            className="flex items-center justify-center p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 h-[40px] w-[40px]"
          >
            {({ loading }) => (loading ? '...' : <Download size={24} />)}
          </PDFDownloadLink>

          
        </div>
        
      )}


{isGenerate ? (
        <>
        <div className="grid grid-cols-1 gap-4 my-6 md:grid-cols-2 lg:grid-cols-4">
  <div className="p-4 bg-gray-700 rounded-lg">
    <h3 className="text-sm font-medium text-gray-300">Total Sales Revenue</h3>
    <p className="text-2xl font-bold text-white">Rs.{totalSalesRevenue.toFixed(2)}</p>
  </div>
  <div className="p-4 bg-gray-700 rounded-lg">
    <h3 className="text-sm font-medium text-gray-300">Total Number of Orders</h3>
    <p className="text-2xl font-bold text-white">{totalNumberOfOrders}</p>
  </div>
  <div className="p-4 bg-gray-700 rounded-lg">
    <h3 className="text-sm font-medium text-gray-300">Total Items Sold</h3>
    <p className="text-2xl font-bold text-white">{totalItemsSold}</p>
  </div>
  <div className="p-4 bg-gray-700 rounded-lg">
    <h3 className="text-sm font-medium text-gray-300">Total Discounts Applied</h3>
    <p className="text-2xl font-bold text-white">Rs.{totalDiscount.toFixed(2)}</p>
  </div>
</div>
          <ReportTable data={currentOrders} />
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 mx-1 text-sm font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 ${currentPage === i + 1 ? 'bg-blue-700' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="py-4 text-center text-white">No Orders Found</div>
      )}

    </div>
  );
};

export default AdminReport;