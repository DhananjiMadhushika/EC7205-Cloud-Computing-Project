import { Mail, Phone, MapPin } from "lucide-react";
import { Quote } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import '../../../App.css'

export default function Aboutus() {
  return (
    <div className="flex flex-col w-full ">
      <div className="relative z-0 top-0 left-0 bg-center bg-cover w-full h-[350px] lg:h-[500px] bg-[url('/client/hero/factory.webp')]">
        {/* Hero Section */}
        <div className="flex w-full h-full items-end justify-end bg-gray-500 bg-opacity-50 max-w-1440 mx-auto px-5 sm:px-8 lg:px-10 pb-3 md:pb-5">
          <h1 className="font-anton text-[52px] sm:text-[64px] lg:text-[84px] text-white capitalize tracking-wide text-end leading-tight">
            <span className="block md:mb-2 ">HARITHAWELI</span>
            <span className="block relative text-4xl sm:text-[52px] lg:text-[62px]">
              READY MIX
            </span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col max-w-1440 mx-auto w-full px-5 sm:px-8 lg:px-10">
        {/* Company Overview */}
        <section className="mt-6 lg:mt-10">
          <h2 className="font-bold text-3xl lg:text-5xl text-center text-slate-900">
            Our Company
            <span className="block w-20 h-1.5  bg-green-700 mx-auto mt-2 lg:mt-3 rounded-full"></span>
          </h2>
          <p className="text-gray-700 sm:text-center text-justify md:text-lg leading-relaxed mt-8 sm:mt-7">
            The expertise of CEEDECS Lanka Holdings dates back to 1999 when it
            was first established and later incorporated in 2016. The company as
            a whole specializes in architectural consultancy, interior
            designing, construction, and manufacture. The strength of the
            company lies in our experience in the construction industry that has
            progressed over a period of 23 years. This in turn has allowed us to
            offer our expertise to both the private and corporate sectors at
            very competitive rates. At CEEDECS Lanka Holdings, we are driven by
            innovation to exceed the expectations of our customers.
          </p>
          <div className="mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-5 lg:gap-8 ">
            <div className="z-0 top-0 left-0 bg-center bg-contain w-full h-[280px] rounded-xl lg:rounded-3xl sm-525:h-[350px] md:h-[250px] lg:h-[350px] bg-[url('/client/hero/companyImage1.webp')] transition-transform duration-300 hover:scale-95"></div>
            <div className="z-0 top-0 left-0 bg-center bg-contain w-full h-[280px] rounded-xl lg:rounded-3xl sm-525:h-[350px] md:h-[250px] lg:h-[350px] bg-[url('/client/hero/companyImage2.webp')] transition-transform duration-300 hover:scale-95"></div>
            <div className="z-0 top-0 left-0 bg-center bg-contain w-full h-[280px] rounded-xl lg:rounded-3xl sm-525:h-[350px] md:h-[250px] lg:h-[350px] bg-[url('/client/hero/companyImage3.webp')] transition-transform duration-300 hover:scale-95"></div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mt-8 md:mt-14 flex justify-center md:px-24">
          <div className="bg-green-700 rounded-2xl md:rounded-[30px] p-2">
            {/* White Border */}
            <div className="border-2 md:border-4 border-white rounded-[14px] md:rounded-[26px] p-5 md:p-10 text-center">
              {/* Vision */}
              <h2 className="text-white text-2xl lg:text-3xl font-bold uppercase mb-4">
                Our Mission
              </h2>
              <p className="text-white lg:text-lg leading-relaxed mb-10">
                Our aim is to be the leading innovative designers in the
                construction industry by maintaining ethical and sustainable
                standards, while we continue to build our legacy through our
                strongly established authenticity, originality, and lasting
                customer & business relationships founded on trust and loyalty.
              </p>

              {/* Mission */}
              <h2 className="text-white text-2xl lg:text-3xl font-bold uppercase mb-4">
                Our Vision
              </h2>
              <p className="text-white lg:text-lg leading-relaxed">
                To add extra joy in the lives of people through innovatively
                designed surroundings.
              </p>
            </div>
          </div>
        </section>

        {/* Our Expertise */}
        <section className="mt-8 md:mt-14">
          <h2 className="font-bold text-3xl lg:text-5xl text-center text-slate-900">
            Our Expertise
            <span className="block w-20 h-1.5 bg-green-700 mx-auto mt-2 lg:mt-3 rounded-full"></span>
          </h2>
          <p className="text-gray-700 sm:text-center md:text-lg text-justify leading-relaxed mt-8 sm:mt-7">
            With unparalleled respect, knowledge, and honest service, we serve
            our customers by creating efficiently interconnected spaces and
            environments. Our team of architects and engineers is dedicated to
            delivering top-notch solutions tailored to our clients' needs.
          </p>
        </section>

        
      {/* Managing Director’s Message */}
        <section className="mt-8 md:mt-14 flex justify-center">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center max-w-3xl">
            <Quote className="w-8 h-8 md:w-10 md:h-10 text-green-700 mx-auto mb-4" />
            <p className="text-base md:text-lg italic text-gray-700">
              "CEEDECS Lanka Holdings (Pvt) Ltd. has come a long way since its
              inception, driven by innovation and a commitment to excellence. We
              take pride in delivering quality solutions that exceed our
              customers' expectations."
            </p>
            <h3 className="text-base md:text-xl font-bold mt-4 text-gray-900">
              Janaka G Mahanama
            </h3>
            <p className="text-sm md:text-base text-green-600 font-semibold">Managing Director</p>
          </div>
        </section>
      </div>

      
      {/* Product Range */}
      <section
        className="mt-8 md:mt-14 bg-cover bg-center bg-fixed text-white py-8 md:py-10 px-5 sm:px-8 lg:px-10 backdrop-blur-2xl"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(236, 233, 230, 0.4), rgba(255, 255, 255, 0)), url('/client/hero/reviewBg.webp')`,
        }}
      >
        <div className="max-w-5xl mx-auto ">
          {/* Section Title */}
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 text-center">
            Our Product Range
            <span className="block w-20 h-1.5 bg-green-700 mx-auto mt-2 lg:mt-3 rounded-full"></span>
          </h2>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8 lg:mt-14">
            {[
              {
                title: "Tile Adhesive",
                description:
                  "Ensures durable and long-lasting tile installations.",
              },
              {
                title: "Water Proofing",
                description:
                  "Protects structures from water damage, enhancing longevity.",
              },
              {
                title: "Brick Bond",
                description: "Provides strong adhesion for brickwork.",
              },
              {
                title: "Wall Putty",
                description: "Smoothens walls for a flawless finish.",
              },
              {
                title: "Clay Putty",
                description:
                  "Offers a natural, eco-friendly wall finishing solution.",
              },
              {
                title: "Tile Mortar",
                description: "Specialized mix for secure tile setting.",
              },
              {
                title: "Ready Mix Plaster",
                description: "Convenient and efficient plastering solution.",
              },
              {
                title: "Terrazzo Floor-Mix",
                description: "Creates beautiful and durable terrazzo flooring.",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white border-spacing-36 border-4 hover:border-[#47b33fe1] shadow-md rounded-xl p-6 transition-transform transform hover:scale-105 hover:shadow-lg text-center"
              >
                <h3 className="text-xl font-bold text-green-500 ">
                  {product.title}
                </h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
{/* YouTube Video Section */}
<section className="mt-8 md:mt-14 px-8 sm:px-10 lg:px-12 bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 text-center">
      Watch Our Videos
      <span className="block w-20 h-1.5 bg-green-700 mx-auto mt-2 lg:mt-3 rounded-full"></span>
    </h2>

    {/* Swiper Carousel */}
    <div className="mt-8">
      <Swiper
        slidesPerView={1} // Show 1 slide on mobile
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 2, // Show 2 slides on tablets
          },
          1024: {
            slidesPerView: 3, // Show 3 slides on desktop
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {/* Video 1 */}
        <SwiperSlide>
          <div className="w-full h-[200px] md:h-[200px] xl:h-[225px]">
            <iframe
              width="640"
              height="360"
              src="https://www.youtube.com/embed/gEzqGLiG8XU?si=78q-97Ccmho93PJR"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </SwiperSlide>

        {/* Video 2 */}
        <SwiperSlide>
          <div className="w-full h-[200px] md:h-[200px] xl:h-[225px]">
            <iframe
              width="640"
              height="360"
              src="https://www.youtube.com/embed/ey6qVwJLCHM?si=sjDN1nwYhqzrQoM6"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </SwiperSlide>

        {/* Video 3 */}
        <SwiperSlide>
          <div className="w-full h-[200px] md:h-[200px] xl:h-[225px]">
            <iframe
              width="640"
              height="360"
              src="https://www.youtube.com/embed/8PEsyfjp434?si=81ItXVuSqupVfcL2"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</section>


      <section className="mt-5 md:mt-10 px-5 sm:px-8 lg:px-10 bg-white">
        <div className="max-w-4xl mx-auto ">
          {/* Section Title */}
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 text-center">
            Contact Us
          </h2>
          <p className="text-gray-600 mt-2.5 text-center">
            We'd love to hear from you! Reach out through any of the following
            ways.
          </p>

          {/* Contact Details */}
          <div className="mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-3">
            {/* Email */}
            <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 text-center transition-transform transform hover:-translate-y-2 hover:shadow-lg">
              <Mail className="text-green-600 w-10 h-10 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">Email</h3>
              <p className="text-gray-700 mt-1">info@harithaweli.lk</p>
            </div>

            {/* Phone */}
            <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 text-center transition-transform transform hover:-translate-y-2 hover:shadow-lg">
              <Phone className="text-green-600 w-10 h-10 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-700 mt-1">+94 710 500 800</p>
            </div>

            {/* Address */}
            <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 text-center transition-transform transform hover:-translate-y-2 hover:shadow-lg">
              <MapPin className="text-green-600 w-10 h-10 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
              <p className="text-gray-700 mt-1">
                132/1, Kandy Road, Mahara, Kadawatha, Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
