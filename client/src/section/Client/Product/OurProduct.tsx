

export default function PaintShop() {
 
  const paintTypes = [
    { name: "Latex Paint", use: "Interior walls and ceilings" },
    { name: "Oil-Based Paint", use: "Trim, doors, and high-traffic areas" },
    { name: "Primer", use: "Surface preparation and coverage" },
    { name: "Specialty Coatings", use: "Waterproofing and protective finishes" }
  ];

 

  return (
    <div className="flex flex-col w-full">
      {/* Header Section */}
      <div className="relative z-0 top-0 left-0 bg-center bg-cover w-full h-[380px] sm-525:h-[350px] lg:h-[400px] bg-[url('/client/product/a.webp')]">
        <div className="flex items-center justify-center w-full h-full bg-slate-900 bg-opacity-70">
          <div className="mt-16 md:mt-24">
            <h1 className="text-3xl sm:text-[56px] lg:text-[72px] font-bold text-white capitalize tracking-wide text-center">
              Our Product
            </h1>
            <h1 className="text-white sm:text-base md:text-xl w-full lg:w-[900px] xl:w-[1200px] px-5 sm:px-8 lg:px-0 text-center leading-relaxed mt-5 sm:mt-8 lg:mt-12">
              Professional painting services for your home and business! We offer premium quality paints, 
              expert color consultation, and flawless application techniques. From interior transformations 
              to exterior protection, our skilled team delivers exceptional results with attention to detail. 
              Transform your space with just one click!
            </h1>
          </div>
        </div>
      </div>


      {/* Paint Types Section */}
      <div className="py-12 bg-gray-50">
        <div className="px-5 mx-auto max-w-1440 sm:px-8 xl:px-10">
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-800 lg:text-3xl">
            Types of Paint We Use
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {paintTypes.map((paint, index) => (
              <div key={index} className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">{paint.name}</h3>
                <p className="text-sm text-gray-600">{paint.use}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-12">
        <div className="px-5 mx-auto max-w-1440 sm:px-8 xl:px-10">
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-800 lg:text-3xl">
            Why Choose Our Paint Shop?
          </h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Expert Color Matching</h3>
              <p className="text-gray-600">Precision color matching technology to achieve your perfect shade</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quick Turnaround</h3>
              <p className="text-gray-600">Efficient service without compromising on quality or attention to detail</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quality Guarantee</h3>
              <p className="text-gray-600">Premium materials and workmanship backed by our satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
}