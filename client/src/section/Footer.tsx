import { BsFacebook, BsInstagram, BsWhatsapp } from "react-icons/bs";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-gray-300 bg-gray-900">
      <div className="grid grid-cols-1 gap-8 px-6 py-12 mx-auto max-w-1440 md:grid-cols-4">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-red-500 font-anton">
            Plaster King Paints
          </h2>
          <p className="mt-3 text-sm">
            Your trusted partner for quality paints, tools, and accessories. 
            Bringing color and life to every space.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-red-500">Home</Link></li>
            <li><Link to="/e-shop" className="hover:text-red-500">E-Shop</Link></li>
            <li><Link to="/about" className="hover:text-red-500">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-red-500">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
          <div className="flex items-center mb-2 space-x-3 text-sm">
            <FaMapMarkerAlt className="" />
            <span>123 Main Street, Colombo, Sri Lanka</span>
          </div>
          <div className="flex items-center mb-2 space-x-3 text-sm">
            <FaPhoneAlt className="" />
            <span>+94 71 050 0800</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <HiOutlineMail className="" />
            <span>support@plasterking.lk</span>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://wa.me/94710500800" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-green-500">
              <BsWhatsapp />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-blue-500">
              <BsFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-pink-500">
              <BsInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-4 text-sm text-center border-t border-gray-700">
        © {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
