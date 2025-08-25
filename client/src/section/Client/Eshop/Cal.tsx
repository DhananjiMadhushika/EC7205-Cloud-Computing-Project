import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CalReport from "./CalReport";
import { QuantityPopup } from "./QuantityPopup";

const productFormulas = {
  "ready-mix-plaster": {
    1: 20,
    2: 33.33,
    3: 50
  },
  "waterproof-plaster": {
    1: 20,
    2: 33.33,
    3: 50
  },
  "clay-putty": {
    1: 90,
    2: 150,
    3: 180
  },
  "brickbond-block": {
    1: 15,
    2: 25,
    3: 30
  },
  "brickbond-brick": {
    1: 9,
    2: 15,
    3: 22.5
  },
  "tilebond-mortar": {
    1: 15,
    2: 25,
    3: 30
  },
  "tilebond-adhesive": {
    1: 30,
    2: 50,
    3: 60
  },
  "clayfloor-titanium": {
    1: 60,
    2: 100,
    3: 120
  },
  "clayfloor-terrazzo": {
    1: 20,
    2: 33.33,
    3: 50
  }
};


export default function Cal() {
  const location = useLocation();
  const { shop, branchId } = location.state || {};

  const [inches, setInches] = useState(0);
  const [quality, setQuality] = useState<1 | 2 | 3>(1);
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpen, setIsopen] = useState(false);

  useEffect(() => {
    if (!shop?.price || !shop?.itemCode) return;
    
    const calculateQuantityAndPrice = () => {
      if (inches <= 0) {
        setQuantity(0);
        setTotalPrice(0);
        return;
      }
      
      const productFormula = productFormulas[shop.itemCode as keyof typeof productFormulas];
      
      if (!productFormula) {
        console.warn(`No formula found for item code: ${shop.itemCode}`);
        return;
      }
      
      const divisor = productFormula[quality];
      const calculatedQuantity = Math.ceil(inches / divisor);
      
      setQuantity(calculatedQuantity);
      setTotalPrice(calculatedQuantity * shop.price);
    };

    calculateQuantityAndPrice();
  }, [shop, quality, inches]);

  return (
    <div className="flex w-full h-full bg-center bg-cover bg-[url('/client/product/g.webp')]">
      <div className="flex w-full bg-black bg-opacity-20">
        <div className="flex items-center w-full px-5 mx-auto mt-24 mb-20 md:mt-32 sm:px-8 xl:px-10 max-w-1440">
          <div className="flex flex-col w-full p-6 shadow-lg gap-y-3 sm-525:p-6 lg:p-8 backdrop-blur-md rounded-xl md:my-8">
            <div className="flex flex-col items-center justify-between w-full gap-5 md:flex-row lg:gap-8">
              <div className="w-2/3 md:w-5/12 border border-gray-200 rounded-xl md:border-none md:bg-[#7e827f8b]">
                <div className="flex w-full p-3 rounded-xl h-[175px] sm-525:h-72 lg:h-96">
                  <img
                    src={shop?.productImage}
                    className="object-contain w-full h-auto"
                    alt={shop?.name || "Product image"}
                  />
                </div>
              </div>

              <div className="w-full py-5 lg:py-4 px-4 lg:px-8 rounded-xl flex flex-col gap-y-4 sm-525:gap-y-6 md:gap-y-6 bg-[#7e827f8b]">
                {/* product name */}
                <div className="flex items-center justify-between w-full gap-3 mt-2 md:gap-5">
                  <label className="block w-6/12 text-sm font-medium text-gray-700 sm-525:w-4/12 lg:w-3/12 text-nowrap md:text-base xl:text-lg">
                    Product:
                  </label>

                  <input
                    type="text"
                    className="w-full p-1 lg:p-2 border lg:border-2 border-gray-200 rounded-[8px] focus:outline-none"
                    value={shop?.name || ""}
                    readOnly
                  />
                </div>
                <div className="flex items-center justify-between w-full gap-3 md:gap-5">
                  <label className="block w-6/12 text-sm font-medium text-gray-700 sm-525:w-4/12 lg:w-3/12 text-nowrap md:text-base xl:text-lg">
                    Item Code:
                  </label>

                  <input
                    type="text"
                    className="w-full p-1 lg:p-2 border lg:border-2 border-gray-200 rounded-[8px] focus:outline-none"
                    value={shop?.itemCode || ""}
                    readOnly
                  />
                </div>

                {/* enter feet field */}
                <div className="flex items-center justify-between w-full gap-3 md:gap-5">
                  <label className="block w-6/12 text-sm font-medium text-gray-700 sm-525:w-4/12 lg:w-3/12 text-nowrap md:text-base xl:text-lg">
                    Enter Feet²:
                  </label>

                  <input
                    type="number"
                    className="w-full p-1 lg:p-2 border lg:border-2 border-gray-200 rounded-[8px] focus:outline-none"
                    value={inches || ""}
                    onChange={(e) => setInches(Number(e.target.value))}
                    min="0"
                  />
                </div>

                {/* Select Quality (Slider) */}
                <div className="flex flex-col justify-between w-full gap-3 sm-525:flex-row md:gap-5">
                  <label className="block w-5/12 text-sm font-medium text-gray-700 sm-525:w-4/12 lg:w-3/12 text-nowrap md:text-base xl:text-lg">
                    Wall Condition:
                  </label>

                  <div className="w-full mt-1 sm-525:mt-0">
                    <div className="w-11/12 ml-2 sm:ml-2 md:ml-3 lg:ml-5">
                    <input
                      type="range"
                      className="w-full cursor-pointer"
                      min="1"
                      max="3"
                      step="1"
                      value={quality}
                      onChange={(e) =>
                        setQuality(parseInt(e.target.value) as 1 | 2 | 3)
                      }
                    />
                    </div>
                  
                  <div className="flex justify-between mt-0 text-sm text-black">
              <div className="flex flex-col items-center cursor-pointer" onClick={() => setQuality(1)}>
                <span>Poor</span>
                <img src="/client/Cal/poor.webp" alt="Low quality" className="mb-1 mr-2 rounded-full w-14 h-14 lg:w-24 lg:h-24 md:w-16 md:h-16" />
              </div>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => setQuality(2)}>
                <span>Normal</span>
                <img src="/client/Cal/normal.webp" alt="Medium quality" className="mb-1 mr-2 rounded-full w-14 h-14 lg:w-24 lg:h-24 md:w-16 md:h-16" />
              </div>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => setQuality(3)}>
                <span>High</span>
                <img src="/client/Cal/high.webp" alt="High quality" className="mb-1 rounded-full w-14 h-14 lg:w-24 lg:h-24 md:w-16 md:h-16" />
              </div>
            </div>

                </div>
                </div>
              </div>
            </div>

            <div className="flex w-full bg-[#7e827f8b] rounded-xl p-4 ">
              {/* Quantity & Price Display */}
              <div className="flex flex-col gap-y-0.5 w-full items-center ">
                <div className="text-lg font-semibold text-gray-700">
                  <span className="text-green-800">Quantity:</span> {quantity}
                </div>
                <div className="mt-2 text-xl font-semibold text-gray-900">
                  Total Cost:{" "}
                  <span className="text-green-800">
                    LKR {totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* button container */}
                <div className="flex flex-col gap-2 mt-6 sm-525:flex-row sm-525:gap-5 ">
                  <button
                    className="px-6 py-2 text-base text-white bg-green-500 hover:bg-green-700 rounded-xl lg:text-lg"
                    onClick={() => setIsopen(true)}
                    disabled={quantity <= 0}
                  >
                    Add to Cart
                  </button>
                  <PDFDownloadLink 
                    document={
                      <CalReport 
                        productName={shop?.name || ""} 
                        inches={inches} 
                        quality={quality} 
                        quantity={quantity} 
                        totalPrice={totalPrice} 
                        mixing={shop?.mixing || ""}
                        applicationMethod={shop?.applicationMethod || ""}
                        storage={shop?.storage || ""}
                      />
                    } 
                    fileName="Product_Calculation.pdf"
                    className={quantity <= 0 ? "pointer-events-none opacity-50" : ""}
                  >
                    <button
                      className="px-6 py-2 text-base text-white bg-green-500 hover:bg-green-700 rounded-xl lg:text-lg"
                      disabled={quantity <= 0}
                    >
                      Download Results
                    </button>
                  </PDFDownloadLink>
                </div>
              </div>
            </div>
          </div>
          <QuantityPopup product={shop} isOpen={isOpen} setIsOpen={setIsopen} />
        </div>
      </div>
    </div>
  );
}