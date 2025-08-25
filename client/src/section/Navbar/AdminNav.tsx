import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { mainItems } from "@/constants/AdminNavData";
import { AdminNavItem } from "./AdminNavItem";
import { IoIosMenu } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";

interface SidebarItem {
  imageSrc: string;
  label: string;
  url?: string;
  subMenu?: { label: string; url: string }[];
}

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navArray?: SidebarItem[];
  userRole?: string;
}

const AdminNav: React.FC<SideBarProps> = ({ 
  isOpen = true, 
  setIsOpen, 
  navArray = mainItems,
  userRole 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const pageNavigation = (url?: string) => {
    navigate(`/${url}`);
  };

  const iconClick = (item: SidebarItem) => {
    if (item.subMenu?.length) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      pageNavigation(item.url);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);
  
  useEffect(() => {
    if (!isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  return (
    <div
      ref={sidebarRef}
      className="fixed hidden w-auto px-3 ml-2 md:block bg-gray-850 h-5/6 rounded-3xl"
    >
      <div
        className={`max-h-[calc(100vh-100px)] h-full ${
          isOpen
            ? "w-[180px] rounded-3xl items-start pl-2 "
            : " w-auto px-1 rounded-bl-3xl items-center"
        } flex flex-col bg-[#144c29] py-5 transition-all duration-300 rounded-tl-3xl `}
      >
        <div
          className={`w-1 h-full bg-black duration-200 top-0 bottom-0 left-[76px] ${
            isOpen ? "absolute" : "hidden"
          }`}
        ></div>

        {/* Toggle Button */}
        <div className="flex items-center justify-start w-full mb-4 ">
          <button className="px-4" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <IoMdArrowRoundBack color="white" className="text-xl" />
            ) : (
              <IoIosMenu color="white" className="text-2xl" />
            )}
          </button>
        </div>

        <div className="flex flex-col justify-between w-auto h-full gap-8 overflow-y-scroll scrollbar-hide">
          {/* Main Sidebar Items */}
          <div className="flex flex-col whitespace-pre-wrap gap-y-1">
            {navArray.map((item, index) => {
              const isActive = location.pathname.startsWith(`/${item.url}`);

              return (
                <AdminNavItem
                  key={index}
                  imageSrc={item.imageSrc}
                  label={item.label}
                  isActive={isActive}
                  onClick={() => iconClick(item)}
                  isOpen={isOpen}
                  userRole={userRole}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;