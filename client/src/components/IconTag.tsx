import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaShareAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const IconTag = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div

   
      className={`fixed bottom-64 sm:bottom-36 right-4 flex items-center justify-center rounded-full bg-gradient-to-b from-gray-600 to-white p-2 shadow-lg sm:shadow-custom1 transition-all duration-300 ${

        isCollapsed ? "w-12 h-12" : "w-auto h-auto"
      }`}
    >
      <div
        className={`flex flex-col sm:flex-col gap-2 transition-all duration-300 ${
          isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
      >
        {/* Facebook */}
        <a
          href="https://www.facebook.com/Harithaweli?mibextid=ZbWKwL"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF className="sm:w-9 sm:h-9 w-6 h-6 scale-75 transition-transform duration-300 transform hover:translate-x-[2px] hover:translate-y-[2px] hover:text-[#1877F2] cursor-pointer" />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/harithaweli.lk?igsh=MTlyOGtwa2lvYzUwOA=="
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="sm:w-9 sm:h-9 w-6 h-6 scale-75 transition-transform duration-300 transform hover:translate-x-[2px] hover:translate-y-[2px] hover:text-[#E1306C] cursor-pointer" />
        </a>

        {/* X (Twitter) */}
        <a
          href="https://x.com/harithaweli?t=pRAWaIsgyH8U6Zhi9_th8A&s=09"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaXTwitter className="sm:w-9 sm:h-9 w-6 h-6 scale-75 transition-transform duration-300 transform hover:translate-x-[2px] hover:translate-y-[2px] hover:text-[#000000] cursor-pointer" />
        </a>

        {/* YouTube */}
        <a
          href="https://m.youtube.com/@harithaweli"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube className="sm:w-9 sm:h-9 w-6 h-6 scale-75 transition-transform duration-300 transform hover:translate-x-[2px] hover:translate-y-[2px] hover:text-[#FF0000] cursor-pointer" />
        </a>

        {/* TikTok */}
        <a
          href="https://www.tiktok.com/@harithawelilk?_t=ZS-8uoF8b8r3cQ&_r=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTiktok className="sm:w-9 sm:h-9 w-6 h-6 scale-75 transition-transform duration-300 transform hover:translate-x-[2px] hover:translate-y-[2px] hover:text-[#000000] cursor-pointer" />
        </a>
      </div>

      {/* Collapsed Circle with Share Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-b from-gray-600 to-gray-400 p-2 shadow-lg transition-all duration-300 ${
          isCollapsed ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
      >
        <FaShareAlt className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};