import { IconTag } from "@/components/IconTag";
import { useEffect, useState } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  // Paint-related background images
  const paintBackgrounds = [
    {
      desktop: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Modern living room with painted walls
      mobile: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      desktop: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2158&q=80', // Beautiful painted interior walls
      mobile: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      desktop: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80', // Stylish painted bedroom
      mobile: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const navigate = useNavigate();
  const phoneNumber = "+94710500800";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % paintBackgrounds.length);
    }, 5000); // Change background every 5 seconds

    return () => clearInterval(interval);
  }, [paintBackgrounds.length]);

  return (
    <>
      {/* Show background on medium and larger screens */}
      <div
        className="hidden w-full transition-all duration-1000 ease-in-out bg-center bg-cover md:block"
        style={{ backgroundImage: `url('${paintBackgrounds[currentBgIndex].desktop}')` }}
      >
        <div className="relative bg-black bg-opacity-50 ">
          <div className="w-full px-5 pt-16 mx-auto max-w-7xl sm:px-8 xl:px-10 sm:pt-24">
            <div className="flex flex-col items-center md:items-start md:w-8/12">
              <h1 className="text-[36px] sm:text-[56px] xl:text-[68px] font-medium text-white tracking-wide font-anton text-center md:text-start uppercase -mt-4 md:-mt-8 drop-shadow-lg pt-10">
                Bringing Lasting Color to Every Surface
              </h1>

              <p className="sm:text-lg text-white mt-5 lg:w-[600px] text-center md:text-start drop-shadow-md bg-black bg-opacity-30 p-4 rounded-lg">
                Transforming spaces with premium paints and supplies. We offer innovative paint solutions with integrity and expertise, creating vibrant environments for residential and commercial spaces island-wide.
              </p>

              <button
                className="flex items-center justify-center h-10 gap-2 px-6 mt-10 mb-5 font-semibold text-white transition-colors bg-blue-500 rounded-full shadow-lg md:mt-10 lg:mt-14 sm:px-8 sm:h-11 hover:bg-blue-700 group"
                onClick={() => navigate("/e-shop")}
              >
                BUY NOW{" "}
                <HiArrowNarrowRight className="text-lg transition-transform group-hover:rotate-6" />
              </button>
            </div>
          </div>

          {/* Background indicator dots */}
          <div className="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-20 left-1/2">
            {paintBackgrounds.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  currentBgIndex === index 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                }`}
                onClick={() => setCurrentBgIndex(index)}
              />
            ))}
          </div>

         
        </div>
      </div>

      {/* Show background on small screens */}
      <div
        className="w-full transition-all duration-1000 ease-in-out bg-center bg-cover md:hidden"
        style={{ backgroundImage: `url('${paintBackgrounds[currentBgIndex].mobile}')` }}
      >
        <div className="h-[600px] sm:h-[720px] bg-opacity-50 bg-black relative">
          <div className="w-full px-5 pt-16 mx-auto max-w-7xl sm:px-8 sm:pt-24">
            <div className="flex flex-col items-center">
              <h1 className="text-[42px] sm:text-[62px] font-medium text-white tracking-wide font-anton text-center uppercase -mt-4 drop-shadow-lg">
                Bringing Lasting Color to Every Surface
              </h1>

              <p className="p-4 mt-5 text-center text-white bg-black rounded-lg drop-shadow-md bg-opacity-30">
                Transforming spaces with premium paints and supplies. We offer innovative paint solutions with integrity and expertise, creating vibrant environments for residential and commercial spaces island-wide.
              </p>

              <button
                className="flex items-center justify-center h-10 gap-2 px-6 font-semibold text-white transition-colors bg-blue-500 rounded-full shadow-lg mt-14 group"
                onClick={() => navigate("/e-shop")}
              >
                BUY PAINT NOW{" "}
                <HiArrowNarrowRight className="text-lg transition-transform group-hover:rotate-6" />
              </button>
            </div>
          </div>

          {/* Background indicator dots */}
          <div className="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-20 left-1/2">
            {paintBackgrounds.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  currentBgIndex === index 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                }`}
                onClick={() => setCurrentBgIndex(index)}
              />
            ))}
          </div>

          {/* WhatsApp Button with Tooltip */}
          <div className="absolute z-10 bottom-6 right-4">
            <div className="relative group">
              {/* Tooltip */}
              <div className="absolute right-0 mb-2 transition-opacity duration-300 opacity-0 pointer-events-none bottom-full group-hover:opacity-100">
                <div className="px-2 py-1 text-sm font-medium text-white rounded-md shadow-lg bg-slate-800 whitespace-nowrap">
                  {phoneNumber}
                  <div className="absolute w-2 h-2 transform rotate-45 bg-slate-800 -bottom-1 right-4"></div>
                </div>
              </div>
              
             
            </div>
          </div>
        </div>
      </div>

      {/* Fixed IconTag - always visible */}
      <div className="fixed z-50 bottom-4 right-4">
        <IconTag />
      </div>
    </>
  );
};

export default Hero;