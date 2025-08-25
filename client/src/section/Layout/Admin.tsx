
import Header from "../Navbar/AdminHeader";
import AdminNavMobile from "../Navbar/AdminNavMobile";
import AdminNav from "../Navbar/AdminNav";
import { useState } from "react";

export default function LayoutA({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  return (
    <div className="bg-black">
      <div className="flex flex-col min-h-screen mx-auto max-w-1440" >
      <Header />
      <AdminNavMobile />
      <div className="flex flex-row flex-grow mt-[100px] xl:mt-[130px]">

        <AdminNav isOpen={isOpenMenu} setIsOpen={setIsOpenMenu}/>

        <div className={`flex flex-col overflow-x-auto w-full px-3 sm:px-4 md:px-0 pb-5 ${isOpenMenu ? "md:ml-[220px]" : "md:ml-[100px]"} md:pr-5 duration-300`}>
          {children}
        </div>
      </div>
    </div>
    </div>

  );
}

