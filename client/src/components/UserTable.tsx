
import { User } from "@/types/UserTypes";
import { FaUser } from "react-icons/fa";

interface Columns {
  header: string | boolean;
  accessor: string;
  className: string;
}

interface UserProps {
  data: User[];
  type?: string;
  onDelete: (id: number) => void;
  onEdit: (user: User) => void;
}

const Table = ({ data }: UserProps) => {

  const tableHeader: Columns[] = [
    {
      header: "Image",
      accessor: "userImage",
      className: "p-3 text-left text-sm font-semibold",
    },
    {
      header: "Name",
      accessor: "name",
      className: "p-3 text-left text-sm font-semibold",
    },
    {
      header: "Email",
      accessor: "email",
      className: "p-3 text-left text-sm font-semibold",
    },
    {
      header: "Phone Number",
      accessor: "phoneNo",
      className: "p-3 text-left text-sm font-semibold",
    },
    
   
  ];
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-[#262626] rounded-lg">
        <thead>
          <tr className="text-white bg-gray-700">
            {tableHeader.map((col) => (
              <th key={col.accessor} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
              } hover:bg-gray-600 transition-colors border-b border-gray-500`}
            >
              <td className="p-3">
                <div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full md:w-10 md:h-10">
                  {item.userImage ? (
                    <img 
                      src={item.userImage} 
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-600">
                      <FaUser className="text-xs text-white" />
                    </div>
                  )}
                </div>
              </td>
              
              <td className="p-3 text-sm text-white">
                <div className="flex flex-col">
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
              </td>
              
              <td className="p-3 text-sm text-white">
                {item.email}
              </td>
              
              <td className="p-3 text-sm text-white">
                {item.phoneNo}
              </td>
              
              
              
              
              
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;