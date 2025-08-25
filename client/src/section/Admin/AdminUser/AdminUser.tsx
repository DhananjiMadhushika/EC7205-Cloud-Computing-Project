import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import Table from "@/components/UserTable";
import { User } from "@/types/UserTypes";
import { useEffect, useState } from "react";

const AdminUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          setLoading(false);
          return;
        }

        const apiUrl = `http://localhost:5000/api/users`; // 👈 your new API

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        const formattedUsers: User[] = result.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNo: user.phoneNumber,
          userImage: user.userImage || null,
        }));

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, users]);

  // 🔹 Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="col-span-1 pt-4 bg-[#262626] rounded-2xl card min-h-screen">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
        <div className="flex w-full gap-4 sm:flex-row sm:items-center sm:justify-between md:w-3/4 xl:w-5/6 ">
          <h1 className="w-3/4 text-lg font-bold text-white md:text-2xl md:w-auto">
            User List
          </h1>
          <Search
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search users..."
          />
        </div>
      </div>

      <hr className="my-0 border-t border-gray-500 xl:md:my-2" />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-400">Loading...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <Table data={currentItems} type="user" onDelete={() => {}} onEdit={() => {}} />
      ) : (
        <div className="py-4 text-center text-white">
          {searchTerm ? "No matching users found" : "No Users Available"}
        </div>
      )}

      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AdminUser;
