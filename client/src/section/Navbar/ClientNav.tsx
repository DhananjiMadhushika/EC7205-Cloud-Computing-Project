import Login from "@/pages/LoginPage";
import { useAuth } from "@/Providers/AuthProvider";
import { showToastinfo } from "@/utils/toast/infoToast";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsBoxSeamFill } from "react-icons/bs";
import {
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaShoppingBag,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import headerLogo from "/client/hero/everlogo.webp";

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string | null>("home");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const pathToTab: { [key: string]: string } = {
      "/": "home",
      "/ourProduct": "ourProduct",
      "/about": "about",
      "/cart": "cart",      
    };

    const currentPath = location.pathname;

    if (currentPath.startsWith("/admin") || currentPath.startsWith("/agent")) {
      return;
    } else if (currentPath.startsWith("/e-shop")) {
      setActiveTab("eshop");
    } else if (currentPath.startsWith("/ourProduct")) {
      setActiveTab("ourProduct");
    } else {
      setActiveTab(pathToTab[currentPath] || "");
    }
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigate = () => {
    navigate("/account");
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      navigate("/cart"); 
    } else {
      navigate("/");
      showToastinfo("Please log in first to access the cart.");
    }
  };

  // Navigation items using your original navigation structure
  const navigationItems = [
    { id: "home", icon: <FaHome />, name: t("Home"), link: "/" },
    {
      id: "ourProduct",
      icon: <BsBoxSeamFill />,
      name: t("Our Products"),
      link: "/ourProduct",
    },
    {
      id: "eshop",
      icon: <FaShoppingBag />,
      name: t("Shop"),
      link: "/e-shop",
    },
    {
      id: "about",
      icon: <FaInfoCircle />,
      name: t("About Us"),
      link: "/about",
    },
  ];

  return (
    <>
      <div className="flex w-full">
        <div className="fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 mx-auto sm:px-8 xl:px-10 max-w-7xl">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src={headerLogo}
                alt="HeaderLogo"
                className="w-auto h-12 md:h-14"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="items-center hidden space-x-8 lg:flex">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`flex items-center space-x-2 px-3 py-2 font-medium transition-colors duration-200 ${
                    activeTab === item.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <a 
                href="tel:+94710500800" 
                className="p-2 text-gray-600 transition-colors duration-200 hover:text-blue-600"
              >
                <FaPhoneAlt className="text-lg" />
              </a>
              
              <button 
                onClick={handleCartClick} 
                className={`p-2 rounded-full transition-all duration-200 ${
                  activeTab === "cart" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                <FaShoppingCart className="text-lg" />
              </button>
              
              {isAuthenticated ? (
                <button
                  onClick={handleNavigate}
                  className="p-2 text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  <FaUser className="text-lg" />
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="p-2 text-gray-600 transition-all duration-200 rounded-full hover:text-blue-600 hover:bg-gray-100"
                >
                  <FaUser className="text-lg" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 z-50 flex items-center justify-around w-full px-4 py-3 text-black bg-white border-t border-gray-100 shadow-lg lg:hidden">
        {[
          { id: "home", icon: <FaHome />, name: t("Home"), link: "/" },
          {
            id: "ourProduct",
            icon: <BsBoxSeamFill />,
            name: t("Our Products"),
            link: "/ourProduct",
          },         
          {
            id: "eshop",
            icon: <FaShoppingBag />,
            name: t("Shop"),
            link: "/e-shop",
          },
          {
            id: "about",
            icon: <FaInfoCircle />,
            name: t("About Us"),
            link: "/about",
          },
        ].map((tab) => (
          <Link
            key={tab.id}
            to={tab.link}
            className={`flex flex-col items-center text-sm transition-all duration-300 ${
              activeTab === tab.id 
                ? "text-blue-600 scale-105" 
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            <span className="mb-1 text-xl">{tab.icon}</span>
            <span className="text-xs">{tab.name}</span>
          </Link>
        ))}
      </nav>

      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}