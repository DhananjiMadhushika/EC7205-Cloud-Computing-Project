import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const StyledSwiper = styled(Swiper)`
  height: auto;
  .swiper-pagination-bullet {
    background-color: #d9d9d9;
    width: 10px;
    height: 10px;
    opacity: 1;
  }
 
  .swiper-pagination-bullet-active {
    background-color: #22c55e;
    width: 10px;
    height: 10px;
    opacity: 1;
  }
 
  .swiper-pagination {
    bottom: 10px;
  }
`;

export default function About() {
  const navigate = useNavigate();

  const handleShowMore = () => {
    navigate("/about");
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50">
      <section className="flex flex-col items-center w-full px-5 py-8 mx-auto md:py-10 xl:py-16 max-w-7xl md:items-start sm:px-8 xl:px-10">
        <h1 className="font-anton md:tracking-wide text-slate-700 text-3xl lg:text-5xl uppercase mb-0.5 sm:mb-1">
          OUR PAINT EXCELLENCE
        </h1>

        <hr className="border-2 border-slate-600 mb-2.5 flex w-full" />

        <div className="grid grid-cols-1 gap-6 mt-5 lg:grid-cols-2 xl:grid-cols-3 lg:mt-10">
          <div className="relative lg:col-span-1 xl:col-span-2">
            <StyledSwiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop={true}
              className="w-full h-96"
            >
              <SwiperSlide>
                <img
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Professional Paint Application"
                  className="object-cover w-full rounded-md shadow-lg h-96"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Beautiful Interior Painting"
                  className="object-cover w-full rounded-md shadow-lg h-96"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2158&q=80"
                  alt="Premium Paint Colors"
                  className="object-cover w-full rounded-md shadow-lg h-96"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
                  alt="Quality Paint Finishes"
                  className="object-cover w-full rounded-md shadow-lg h-96"
                />
              </SwiperSlide>
            </StyledSwiper>
          </div>

          <div className="p-5 border border-blue-200 shadow-lg bg-white/80 backdrop-blur-sm lg:p-6 rounded-xl">
            <p className="text-sm leading-relaxed text-justify text-slate-700 md:text-base">
              At our paint shop, we are passionate about transforming spaces with premium quality paints and exceptional service. We believe that the right paint doesn't just color your walls – it brings your vision to life and creates lasting beauty.
              <br /><br />
              With years of expertise in the paint industry, we offer an extensive range of eco-friendly, durable paints that cater to both residential and commercial projects. Our commitment to quality means every product we sell meets the highest standards for coverage, longevity, and environmental responsibility.
             
             </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleShowMore}
                className="bg-blue-500 hover:bg-blue-600 text-sm md:text-base text-white px-6 py-2.5 rounded-full transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
              >
                LEARN MORE
              </button>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="grid w-full grid-cols-1 gap-6 mt-12 md:grid-cols-3">
          <div className="p-6 text-center border border-blue-100 shadow-md bg-white/70 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">Premium Quality</h3>
            <p className="text-sm text-slate-600">Only the finest paints from trusted brands, ensuring superior coverage and durability for all your projects.</p>
          </div>

          <div className="p-6 text-center border border-blue-100 shadow-md bg-white/70 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">Eco-Friendly</h3>
            <p className="text-sm text-slate-600">Environmentally conscious paint solutions with low VOC formulations for healthier indoor air quality.</p>
          </div>

          <div className="p-6 text-center border border-blue-100 shadow-md bg-white/70 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-600 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">Expert Advice</h3>
            <p className="text-sm text-slate-600">Professional color consultation and technical support to help you achieve perfect results every time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}