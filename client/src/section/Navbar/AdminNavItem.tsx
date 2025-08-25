import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SidebarItemProps {
  imageSrc: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isOpen: boolean;
  subMenu?: { label: string; url: string }[];
  userRole?: string;
}

export const AdminNavItem: React.FC<SidebarItemProps> = ({
  imageSrc,
  label,
  isActive,
  onClick,
  isOpen,
  subMenu,
  userRole,
}) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const navigate = useNavigate();

  const pageNavigation = (url: string) => {
    navigate(`/${url}`);
    setIsSubOpen(false);
  };

  const handleSubMenu = () => {
    if (subMenu?.length) {
      if (!isOpen) {
        onClick();
      }
      setIsSubOpen(!isSubOpen);
    } else {
      onClick();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsSubOpen(false);
    }
  }, [isOpen]);

  const spacingClass = userRole === "rep" 
    ? "py-4 my-0"
    : "py-2 my-0";

  return (
    <div className="flex flex-col">
      <div className={`flex items-center ${spacingClass} rounded-lg group duration-200`}>
        <div
          onClick={handleSubMenu}
          className={`p-3 rounded-full font-bold transition-colors cursor-pointer hover:bg-green-600 ${
            isActive ? "bg-green-500" : ""
          }`}
        >
          <img
            src={imageSrc}
            alt={label}
            width={30}
            height={30}
            className="max-w-[22px] max-h-[28px] min-w-[15px] min-h-[15px] group-hover:rotate-6 duration-200"
          />
        </div>
        <span
          onClick={handleSubMenu}
          className={`ml-6 font-bold transition-colors cursor-pointer ${
            isOpen ? "block" : "hidden"
          } ${isActive ? "text-yellow-200" : "text-white"}`}
        >
          {label}
        </span>
      </div>

      {isSubOpen && subMenu && (
        <div className="ml-[65px] flex flex-col gap-y-2">
          {subMenu.map((sub, index) => (
            <span
              key={index}
              onClick={() => {
                pageNavigation(sub.url);
                setIsSubOpen(false);
              }}
              className="px-2 text-white text-sm cursor-pointer py-2 hover:font-semibold hover:bg-green-500 text-center rounded-[8px] bg-gray-400/10 hover:scale-95"
            >
              {sub.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
