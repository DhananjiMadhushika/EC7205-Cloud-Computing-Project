import { Order } from "@/types/OrderTypes";


interface Columns {
  header: string; 
  accessor: string; 
  className: string
}

interface OrderProps {
  data: Order[];
  
  
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
  { header: "Branch", accessor: "branch", className: "" },
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

const ReportTable = ({ data } : OrderProps ) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <table className="w-full mt-4 bg-gray-800 min-w-max ">
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
                  <span>{item.name.split(" ")[0]}</span> {/* Extract Name */}
                  <span>{item.name.split(" ")[1]}</span>{" "}
                  {/* Extract Phone Number */}
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

              <td className="px-4 py-2 text-xs md:text-sm">{item.branch}</td>
              <td>
                <ul className="px-4 py-2 text-xs md:text-sm">
                  {item.orderedProducts.split(", ").map((product: any) => (
                    <li key={product.id}>{product}</li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-2 text-xs md:text-sm">{item.date}</td>
              <td className="px-4 py-2 text-xs md:text-sm">{item.status}</td>
              <td className="px-4 py-2 text-xs md:text-sm">{item.netAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
