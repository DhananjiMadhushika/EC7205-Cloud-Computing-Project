import { BackButton } from "@/components/button/BackButton";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Category {
  _id?: string;
  id?: string;
  name: string;
}

interface Color {
  _id?: string;
  id?: string;
  name: string;
  hexCode: string;
}

function AdminAddProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
    
  const existingProduct = location.state?.product || null;

  // Form states matching backend API
  const [id] = useState(existingProduct?.id || existingProduct?._id || null);
  const [name, setName] = useState(existingProduct?.name || "");
  const [description, setDescription] = useState(existingProduct?.description || ""); // Added description state
  const [volume, setVolume] = useState(existingProduct?.volume?.toString() || "");
  const [price, setPrice] = useState(existingProduct?.price?.toString() || "");
  const [stock, setStock] = useState(existingProduct?.stock?.toString() || "");
  const [categoryId, setCategoryId] = useState(existingProduct?.categoryId?.toString() || existingProduct?.category?._id || existingProduct?.category?.id || "");
  
  // Changed to handle multiple colors
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>(
    existingProduct?.colors?.map((pc: any) => (pc.colorId || pc.color?._id || pc.color?.id || pc._id || pc.id)?.toString()) || []
  );
  
  const [finish, setFinish] = useState(existingProduct?.finish || "");
  const [coverage, setCoverage] = useState(existingProduct?.coverage || "");
  const [dryingTime, setDryingTime] = useState(existingProduct?.dryingTime || "");
  const [coats, setCoats] = useState(existingProduct?.coats?.toString() || "2");
  const [isActive, setIsActive] = useState(existingProduct?.isActive ?? true);
  const [productImage, setProductImage] = useState(existingProduct?.productImage || null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories and colors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, colorsRes] = await Promise.all([
          axios.get("http://localhost:3001/category"),
          axios.get("http://localhost:3001/colors")
        ]);
        
        // Transform the data to handle both _id and id formats
        const transformedCategories = categoriesRes.data.map((cat: any) => ({
          ...cat,
          id: cat._id || cat.id
        }));
        
        const transformedColors = colorsRes.data.map((color: any) => ({
          ...color,
          id: color._id || color.id
        }));
        
        setCategories(transformedCategories);
        setColors(transformedColors);
      } catch (error) {
        console.error("Failed to fetch categories or colors", error);
      }
    };

    fetchData();
  }, []);

  const handleProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedFile = await compressImage(file);
      setProductFileToBase(compressedFile);
    }
  };

  const setProductFileToBase = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      console.log("Product Image Base64:", reader.result);
      setProductImage(reader.result as string);
    };
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Image compression error:", error);
      return file;
    }
  };

  // Handle color selection/deselection
  const handleColorSelection = (colorId: string) => {
    setSelectedColorIds(prev => {
      if (prev.includes(colorId)) {
        // Remove color if already selected
        return prev.filter(id => id !== colorId);
      } else {
        // Add color if not selected
        return [...prev, colorId];
      }
    });
  };

  // Handle select all colors
  const handleSelectAllColors = () => {
    if (selectedColorIds.length === colors.length) {
      setSelectedColorIds([]);
    } else {
      setSelectedColorIds(colors.map(color => (color.id || color._id)?.toString() || ''));
    }
  };

  const addOrUpdateProduct = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!name || !price) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const productData = {
      name,
      description, // Added description to product data
      volume: volume || undefined,
      price,
      stock: stock || undefined,
      productImage: productImage || existingProduct?.productImage,
      categoryId: categoryId || undefined,
      colorIds: selectedColorIds, // Send array of color IDs
      finish: finish || undefined,
      coverage: coverage || undefined,
      dryingTime: dryingTime || undefined,
      coats: coats || undefined,
      isActive
    };

    console.log("Final productData:", productData);

    try {
      setLoading(true);

      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("Authentication required. Please log in again.");
        return;
      }

      let response;
      if (id) {
        response = await axios.put(
          `http://localhost:3001/products/${id}`,
          productData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3001/products/",
          productData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(
          id ? "Product updated successfully!" : "Product added successfully!"
        );
        
        setTimeout(() => {
          navigate("/products", { state: { refresh: true } });
        }, 1500);
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response);
        if (error.response.data?.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      } else {
        setErrorMessage("Server is unreachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get the ID from category or color object
  const getItemId = (item: Category | Color): string => {
    return (item.id || item._id || '').toString();
  };

  return (
    <div className="flex-1 p-4 md:p-6 xl:p-10 bg-[#262626] min-h-screen text-green-600 rounded-2xl">
      <BackButton />
      <p className="mt-2 text-xl font-semibold text-center text-green-600 capitalize md:text-4xl md:font-bold">
        {id ? "Update Product" : "Add Product"}
      </p>

      <form className="max-w-4xl mx-auto mt-5" onSubmit={addOrUpdateProduct}>
        {/* Basic Product Information */}
        <div className="grid sm-525:grid-cols-2 sm-525:gap-5 md:gap-6">
          <div className="mb-3 sm-525:mb-5">
            <label
              htmlFor="name"
              className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            >
              Product Name * :
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
              required
            />
          </div>
          
          <div className="mb-3 sm-525:mb-5">
            <label
              htmlFor="price"
              className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            >
              Price * :
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
              required
            />
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-3 sm-525:mb-5">
          <label
            htmlFor="description"
            className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
          >
            Product Description :
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter product description, features, benefits, etc."
            className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600 resize-vertical"
          />
        </div>

        <div className="grid sm-525:grid-cols-3 sm-525:gap-5 md:gap-6">
          <div className="mb-3 sm-525:mb-5">
            <label
              htmlFor="volume"
              className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            >
              Volume (Liters) :
            </label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
            />
          </div>
          
          <div className="mb-3 sm-525:mb-5">
            <label
              htmlFor="stock"
              className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            >
              Stock Quantity :
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
            />
          </div>
          
          <div className="mb-3 sm-525:mb-5">
            <label
              htmlFor="coats"
              className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            >
              Recommended Coats :
            </label>
            <input
              type="number"
              value={coats}
              onChange={(e) => setCoats(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="grid sm-525:grid-cols-2 sm-525:gap-5 md:gap-6">
          <div className="mb-3 sm-525:mb-5">
            <label className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white">
              Category :
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={getItemId(category)} value={getItemId(category)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Multiple Colors Selection */}
        <div className="mb-5">
          <label className="block mb-3 text-sm font-medium text-white capitalize md:text-base">
            Colors Available :
          </label>
          
          {/* Select All / Deselect All Button */}
          <div className="mb-3">
            <button
              type="button"
              onClick={handleSelectAllColors}
              className="px-3 py-1 text-sm text-white transition-colors bg-green-600 rounded hover:bg-green-700"
            >
              {selectedColorIds.length === colors.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="ml-3 text-sm text-gray-300">
              {selectedColorIds.length} of {colors.length} colors selected
            </span>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {colors.map((color) => {
              const colorId = getItemId(color);
              return (
                <div
                  key={colorId}
                  onClick={() => handleColorSelection(colorId)}
                  className={`
                    cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105
                    ${selectedColorIds.includes(colorId) 
                      ? 'border-green-500 bg-green-100/10' 
                      : 'border-gray-600 bg-black/50 hover:border-gray-500'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {/* Color Circle */}
                    <div 
                      className="w-8 h-8 border-2 border-gray-400 rounded-full"
                      style={{ backgroundColor: color.hexCode }}
                      title={color.hexCode}
                    ></div>
                    
                    {/* Color Name */}
                    <span className="text-xs font-medium text-center text-white">
                      {color.name}
                    </span>
                    
                    {/* Checkmark for selected colors */}
                    {selectedColorIds.includes(colorId) && (
                      <div className="text-sm text-green-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Colors Summary */}
          {selectedColorIds.length > 0 && (
            <div className="p-3 mt-3 rounded-lg bg-black/30">
              <p className="mb-2 text-sm text-gray-300">Selected Colors:</p>
              <div className="flex flex-wrap gap-2">
                {selectedColorIds.map(colorId => {
                  const color = colors.find(c => getItemId(c) === colorId);
                  return color ? (
                    <span 
                      key={colorId}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-green-300 rounded bg-green-600/20"
                    >
                      <div 
                        className="w-3 h-3 border border-gray-400 rounded-full"
                        style={{ backgroundColor: color.hexCode }}
                      ></div>
                      {color.name}
                      <button
                        type="button"
                        onClick={() => handleColorSelection(colorId)}
                        className="ml-1 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Product Image Upload */}
        <div className="mb-5">
          <label
            className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white"
            htmlFor="product_image"
          >
            Upload Product Image :
          </label>
          {productImage && (
            <img
              src={productImage}
              alt="Product Preview"
              className="object-cover p-2 mb-2 border border-gray-500 rounded-lg sm-525:w-36 md:h-36 w-28 h-28"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleProductImage}
            className="block w-full text-sm text-white rounded-lg cursor-pointer bg-black p-2.5 focus:outline-none focus:border focus:border-green-600"
          />
        </div>

        {/* Product Specifications */}
        <label className="block mb-5 text-sm font-medium text-white md:text-base">
          Product Specifications
        </label>

        <div className="grid sm-525:grid-cols-2 sm-525:gap-5 md:gap-6">
          <div className="mb-3 sm-525:mb-5">
            <label className="uppercase block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-green-600">
              FINISH :
            </label>
            <input
              type="text"
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
              placeholder="e.g., Matte, Gloss, Satin"
            />
          </div>
          
          <div className="mb-3 sm-525:mb-5">
            <label className="uppercase block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-green-600">
              DRYING TIME :
            </label>
            <input
              type="text"
              value={dryingTime}
              onChange={(e) => setDryingTime(e.target.value)}
              className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
              placeholder="e.g., 2-4 hours"
            />
          </div>
        </div>

        <div className="mb-3 sm-525:mb-5">
          <label className="uppercase block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-green-600">
            COVERAGE :
          </label>
          <input
            type="text"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            className="bg-black border-black text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
            placeholder="e.g., 12-15 sq.m per liter"
          />
        </div>

        {/* Product Status */}
        <div className="mb-5">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 mr-2 text-green-600 bg-black border-gray-600 rounded focus:ring-green-500"
            />
            <span className="text-sm font-medium text-white md:text-base">
              Active Product (visible to customers)
            </span>
          </label>
        </div>

        <div className="py-5">
          {errorMessage && <p className="text-red-500">* {errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <div className="flex justify-end gap-2.5 md:gap-4 mt-10">
            <button
              type="submit"
              className="text-white bg-green-700 hover:bg-green-800 rounded-lg px-5 py-1.5 text-sm md:text-base"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {id ? "Updating..." : "Saving..."}
                </div>
              ) : (
                id ? "Update" : "Save"
              )}
            </button>
            <button
              type="button"
              className="text-white bg-gray-500 hover:bg-gray-600 rounded-lg px-5 py-1.5 text-sm md:text-base"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminAddProducts;