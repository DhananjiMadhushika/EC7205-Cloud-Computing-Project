import axios from "axios";
import { useEffect, useState } from "react";

interface HeaderTypes {
  user?: string;
}

const Header = ({ user }: HeaderTypes) => {
  const [isLogin, setIsLogin] = useState(false);
  const [logedUserName, setLogedUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }

        const response = await axios.get("http://localhost:3000/auth/me", {
         headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          console.log("User data:", response.data);
          setIsLogin(true);
          setLogedUserName(response.data.name);
          setUserRole(response.data.role.toLowerCase());
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, []);

  const getDisplayTitle = () => {
    switch (userRole) {
      case "admin":
        return "Super Admin";
      case "agent":
        return "Agent";
      case "rep":
        return "Sales Rep";
      default:
        return user === "admin" ? "Super Admin" : user === "agent" ? "Agent" : user === "rep" ? "Sales Rep" : "";
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 hidden w-full md:block bg-gradient-to-br from-black via-green-950 to-black">
      <div className="w-full flex items-center justify-between px-5 py-2 h-[75px] lg:h-[80px]  xl:h-[100px] 2xl:h-[110px] max-w-1440 mx-auto">
        {/* Logo */}
        <img
          src="/client/hero/logo.webp"
          alt="HeaderLogo"
          className="w-auto h-14 xl:h-20"
        />

        {/* profile */}
        <div className="flex items-center justify-center space-x-3 lg:space-x-4 ">
          <div className="flex flex-col gap-y-1">
            <h1 className="text-xl font-semibold text-gray-400 capitalize">
              {getDisplayTitle()}
            </h1>

            {isLogin ? (
              <p className="text-sm font-medium text-gray-500 capitalize">
                {logedUserName}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="flex ">
            <div className="rounded-full w-[60px] h-[60px] flex items-center justify-center bg-black">
              <img
                src="/client/hero/avatar.webp"
                alt="Profile"
                className="w-[50px] h-[50px] rounded-full border-2 border-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;