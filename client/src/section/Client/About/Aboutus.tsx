import { Mail, Phone, MapPin } from "lucide-react";
import { Quote } from "lucide-react";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import '../../../App.css'

export default function Aboutus() {
  return (
    <div className="flex flex-col w-full ">
      <div className="relative z-0 top-0 left-0 bg-center bg-cover w-full h-[350px] lg:h-[500px] bg-[url('/client/hero/factory.webp')]">
        {/* Hero Section */}
        <div className="flex items-end justify-end w-full h-full px-5 pb-3 mx-auto bg-gray-500 bg-opacity-50 max-w-1440 sm:px-8 lg:px-10 md:pb-5">
          <h1 className="font-anton text-[52px] sm:text-[64px] lg:text-[84px] text-white capitalize tracking-wide text-end leading-tight">
            <span className="block md:mb-2 ">EverCoat</span>
            <span className="block relative text-4xl sm:text-[52px] lg:text-[62px]">
              BRINGING WALLS TO LIFE
            </span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col w-full px-5 mx-auto max-w-1440 sm:px-8 lg:px-10">
        {/* Company Overview */}
        <section className="mt-6 lg:mt-10">
          <h2 className="text-3xl font-bold text-center lg:text-5xl text-slate-900">
            Our Company
            <span className="block w-20 h-1.5  bg-green-700 mx-auto mt-2 lg:mt-3 rounded-full"></span>
          </h2>
          <p className="mt-8 leading-relaxed text-justify text-gray-700 sm:text-center md:text-lg sm:mt-7">
            EverCoat has been serving the community with premium quality paints and coatings 
            since our establishment. We specialize in providing a comprehensive range of 
            interior and exterior paints, protective coatings, and painting solutions for 
            residential, commercial, and industrial projects. Our commitment to excellence 
            and customer satisfaction has made us a trusted name in the paint industry, 
            offering professional advice and high-quality products at competitive prices.
          </p>
         
        </section>

        {/* Our Mission */}
        <section className="flex justify-center mt-8 md:mt-14 md:px-24">
          <div className="bg-blue-600 rounded-2xl md:rounded-[30px] p-2 w-full">
            <div className="border-2 md:border-4 border-white rounded-[14px] md:rounded-[26px] p-5 md:p-10 text-center">
              <h2 className="mb-4 text-2xl font-bold text-white uppercase lg:text-3xl">
                Our Mission
              </h2>
              <p className="mb-10 leading-relaxed text-white lg:text-lg">
                To provide our customers with the highest quality paints and coatings, 
                coupled with expert advice and exceptional service. We strive to be 
                the preferred paint shop in our community by consistently delivering 
                products that enhance and protect every surface we help transform.
              </p>

              <h2 className="mb-4 text-2xl font-bold text-white uppercase lg:text-3xl">
                Our Vision
              </h2>
              <p className="leading-relaxed text-white lg:text-lg">
                To be the leading paint shop that transforms spaces with color, 
                quality, and creativity, making every project a masterpiece.
              </p>
            </div>
          </div>
        </section>

       <section className="flex justify-center mt-8 md:mt-14">
          <div className="max-w-3xl p-6 text-center border border-blue-100 rounded-lg shadow-md bg-blue-50">
            <Quote className="w-8 h-8 mx-auto mb-4 text-blue-600 md:w-10 md:h-10" />
            <p className="text-base italic text-gray-700 md:text-lg">
              "At EverCoat, we believe that every surface tells a story, and we're here 
              to help you tell yours with the perfect color and finish. Our dedication 
              to quality products and personalized service ensures that your vision 
              becomes reality."
            </p>
            <h3 className="mt-4 text-base font-bold text-gray-900 md:text-xl">
              Janaka M Pathirana
            </h3>
            <p className="text-sm font-semibold text-blue-600 md:text-base">Store Owner</p>
          </div>
        </section>


      </div>




      <section className="px-5 mt-5 bg-white md:mt-10 sm:px-8 lg:px-10">
        <div className="max-w-4xl mx-auto ">
          {/* Section Title */}
          <h2 className="text-3xl font-bold text-center lg:text-5xl text-slate-900">
            Contact Us
          </h2>
          <p className="text-gray-600 mt-2.5 text-center">
            We'd love to hear from you! Reach out through any of the following
            ways.
          </p>

          {/* Contact Details */}
          <div className="grid grid-cols-1 gap-4 mt-8 mb-3 lg:mt-10 sm:grid-cols-3 lg:gap-6">
            {/* Email */}
            <div className="p-6 text-center transition-transform transform border border-gray-200 shadow-sm bg-gray-50 rounded-xl hover:-translate-y-2 hover:shadow-lg">
              <Mail className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Email</h3>
              <p className="mt-1 text-gray-700">info@harithaweli.lk</p>
            </div>

            {/* Phone */}
            <div className="p-6 text-center transition-transform transform border border-gray-200 shadow-sm bg-gray-50 rounded-xl hover:-translate-y-2 hover:shadow-lg">
              <Phone className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
              <p className="mt-1 text-gray-700">+94 71 050 0800</p>
            </div>

            {/* Address */}
            <div className="p-6 text-center transition-transform transform border border-gray-200 shadow-sm bg-gray-50 rounded-xl hover:-translate-y-2 hover:shadow-lg">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
              <p className="mt-1 text-gray-700">
                123 Main Street, Colombo, Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
