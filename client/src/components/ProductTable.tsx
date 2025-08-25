import { Product } from "@/types/ProductType";
import { FiEdit, FiTrash } from "react-icons/fi";

interface columns {
  header: string;
  accessor: string;
  className: string;
}

interface ProductProps {
  data: Product[];
  onSelectProduct: (item: Product, action: "edit" | "delete") => void;
  type: string;
}

const getTableHeaders = (type: string): columns[] => {
  const baseHeaders: columns[] = [
    { header: "", accessor: "id", className: " text-red" },
    {
      header: "Product Details",
      accessor: "info",
      className: "text-xs md:text-sm text-red",
    },
    {
      header: "Status",
      accessor: "status",
      className: "text-xs md:text-sm text-red",
    },
    {
      header: "Stock",
      accessor: "stock",
      className: "text-xs md:text-sm text-red",
    },
    { header: "Price", accessor: "price", className: "text-xs md:text-sm" },
  ];

  if (type === "admin") {
    return [
      ...baseHeaders,
      { header: "Action", accessor: "action", className: "text-xs md:text-sm" },
    ];
  }

  return baseHeaders;
};

export const ProductTable = ({ data, onSelectProduct, type }: ProductProps) => {
  const tableHeaders = getTableHeaders(type);

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <table className="w-full mt-4 bg-gray-800 min-w-max">
        <thead className="text-white bg-gray-900">
          <tr className="h-10 text-sm text-left">
            {tableHeaders.map((col) => (
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
              <td className="w-4"></td>
              <td className="flex items-center justify-start">
                <div className="flex items-center gap-2">
                  <img src={item.image} className="w-[60px] h-[60px]" alt={item.name} />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
              </td>
              <td className="px-4 py-2 text-xs md:text-sm">{item.status}</td>
              <td className="px-4 py-2 text-xs md:text-sm">{item.stock}</td>
              <td className="px-4 py-2 text-xs md:text-sm">{item.price}</td>
              {type === "admin" && (
                <td className="px-4 py-2 text-xs md:text-sm w-[120px]">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectProduct(item, "edit")}
                      className="flex items-center justify-center w-8 h-8 font-bold text-white bg-green-500 rounded-full hover:bg-green-600"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => onSelectProduct(item, "delete")}
                      className="flex items-center justify-center w-8 h-8 font-bold text-white bg-red-500 rounded-full hover:bg-red-600"
                    >
                      <FiTrash />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;