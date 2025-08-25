import { mainItems } from "@/constants/AdminNavData";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItemProps {
  imageSrc: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isOpen: boolean;
  url?: string; 
  subMenu?: { label: string; url: string }[];
}

interface MobileNavItem {
  imageSrc: string;
  label: string;
  url: string;
  subMenu?: { label: string; url: string }[];
}

interface MobileNavProps {
  navArray? : MobileNavItem[];
}

const MenuItem: React.FC<MenuItemProps> = ({
  imageSrc,
  label,
  isActive,
  onClick,
  isOpen,
  subMenu,
}) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const navigate = useNavigate();

  const pageNavigation = (url: string) => {
    navigate(`/${url}`);
    setIsSubOpen(false);
  };

  const handleSubMenu = () => {
    if (subMenu) {
      setIsSubOpen(!isSubOpen);
    } else {
      onClick();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center my-1 rounded-lg ">
        <div
          onClick={handleSubMenu}
          className={`p-3 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-green-600 ${
            isActive ? "bg-green-500" : "bg-darkBlue-700"
          }`}
        >
          <img
            src={imageSrc}
            alt={label}
            width={50}
            height={50}
            className="w-6 h-6"
          />
        </div>
        <span
          onClick={handleSubMenu}
          className={`ml-6 cursor-pointer ${isOpen ? "block" : "hidden"} ${
            isActive ? "text-green-200" : "text-white"
          }`}
        >
          {label}
        </span>
      </div>

      {isSubOpen && subMenu && (
        <div className="ml-[72px] flex flex-col gap-y-2">
          {subMenu.map((sub, index) => (
            <span
              key={index}
              onClick={() => {
                pageNavigation(sub.url);
                setIsSubOpen(false);
              }}
              className="text-white cursor-pointer py-2 hover:text-green-200 w-10/12 sm-525:w-8/12 sm:w-1/2 text-center rounded-[8px] bg-gray-400/10 hover:scale-95"
            >
              {sub.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminNavMobile: React.FC<MobileNavProps> = ({navArray = mainItems}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const pageNavigation = (url?: string) => {
    navigate(`/${url}`);
    setIsOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div>
      <div className="w-full md:hidden fixed z-50 bg-gradient-to-br from-black via-green-950 to-black">
        <div className="flex items-center justify-between p-4 h-[78px]">
          {/* Logo */}
          <img
            src="/client/hero/logo.webp"
            alt="HeaderLogo"
            className="w-auto h-14"
          />
          <button onClick={() => setIsOpen(true)} className="text-xl">
            <div className="bg-[#262626] p-2.5 rounded-full">
              <RiMenu2Fill color="white" />
            </div>
          </button>
        </div>

        {/* Full-screen menu overlay */}
        <div
          className={`z-50 duration-300 fixed ${
            isOpen ? "left-0" : "left-[-750px]"
          }  top-0 w-full h-full bg-black  `}
        >
          <div className=" w-full h-full relative text-white ">
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-br from-black via-green-950 to-black ">
              {/* Logo */}
              <img
                src="/client/hero/logo.webp"
                alt="HeaderLogo"
                className="w-auto h-14"
              />

              {/* close button */}
              <button onClick={() => setIsOpen(false)} className="text-xl">
                <div className="flex items-center justify-center rounded-full font-bold p-2.5  bg-[#262626] ">
                  <X />
                </div>
              </button>
            </div>

            <div className="p-4">
              <div className="flex flex-col w-full rounded-2xl p-4 py-5 bg-[#262626] h-[430px]">
                {/* Scrollable Menu Items */}
                <div className="flex flex-col  overflow-y-scroll scrollbar-hide">
                  {navArray.map((item, index) => {
                    const isActive =
                      location.pathname.startsWith(`/${item.url}`) ||
                      !!item.subMenu?.some((sub) =>
                        location.pathname.startsWith(`/${sub.url}`)
                      );

                    return (
                      <MenuItem
                        key={index}
                        imageSrc={item.imageSrc}
                        label={item.label}
                        isActive={isActive}
                        onClick={() => pageNavigation(item.url)}
                        isOpen={isOpen}
                        subMenu={item.subMenu}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavMobile;
