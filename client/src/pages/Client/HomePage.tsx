import About from "@/section/Client/Home/About";
import Counter from "@/section/Client/Home/Counter";
import Hero from "@/section/Client/Home/Hero";
import Reviews from "@/section/Client/Home/Reviews";
import LayoutC from "@/section/Layout/Client";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoginPage from "../LoginPage";
// Make sure to use the correct import path

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Check if we should open the login modal
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('openLogin') === 'true') {
      setIsLoginOpen(true);
    }
  }, [location]);

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <LayoutC>
      <Hero />
      <About />
    
      <Counter />  
      <Reviews />        
    
      
      {/* Login Modal */}
      <LoginPage isOpen={isLoginOpen} onClose={handleCloseLogin} />
    </LayoutC>
  );
}