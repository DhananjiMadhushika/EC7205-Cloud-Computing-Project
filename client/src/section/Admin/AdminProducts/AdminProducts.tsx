import { AddButton } from "@/components/button/AddButton";
import { Category, Color, Product } from "@/types/ProductType";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

function AdminProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:3001/products";
      const params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append('categoryId', selectedCategory);
      }
      if (selectedColor) {
        params.append('colorId', selectedColor);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      console.log(response);
      
      // Handle both response structures
      const productsData = response.data.data || response.data || [];
      
      // Transform the data to match expected structure
      const transformedProducts = productsData.map((product: any) => ({
        ...product,
        id: product._id || product.id, // Handle both _id and id
        colors: product.colors || [],
        category: product.category || null,
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/category");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get("http://localhost:3001/colors");
      setColors(response.data || []);
    } catch (error) {
      console.error("Failed to fetch colors", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchColors();
  }, [selectedCategory, selectedColor]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchProducts();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token found");
          return;
        }
        await axios.delete(
          `http://localhost:3001/products/${productToDelete}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        
        setProducts(
          products.filter((product) => product.id !== productToDelete)
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  const openDeleteModal = (productId: string) => {
    setProductToDelete(productId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsModalOpen(false);
  };

  // Helper function to get colors from the new structure
  const getProductColors = (product: Product) => {
    // Handle new many-to-many structure
    if (product.colors && Array.isArray(product.colors)) {
      return product.colors.map(pc => pc.color || pc);
    }
    // Fallback for old structure during migration
    if (product.color) {
      return [product.color];
    }
    return [];
  };

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="flex-1 p-4 md:p-6 xl:p-10 bg-[#262626] min-h-screen rounded-2xl">
      {/* Header with Add Buttons */}
      <div className="flex flex-col-reverse justify-between mb-8 sm-425:flex-row sm-525:mb-10 gap-y-3">
        <h1 className="text-2xl font-semibold text-white md:text-2xl xl:text-3xl">
          List of Products
        </h1>
        <div className="flex justify-end gap-2">
          <AddButton
            label="+ Categories"
            buttonClick={() => navigate("/products/manage-categories")}
          />
          <AddButton
            label="+ Colors"
            buttonClick={() => navigate("/products/manage-colors")}
          />
          <AddButton
            label="+ Add Product"
            buttonClick={() => navigate("/products/add-products")}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row">
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-white">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black border border-gray-600 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-green-600"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id || category._id} value={category.id || category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-white">Filter by Color:</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="bg-black border border-gray-600 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-green-600"
          >
            <option value="">All Colors</option>
            {colors.map((color) => (
              <option key={color.id || color._id} value={color.id || color._id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-400">Loading...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-400">No products available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm-525:grid-cols-2 md:grid-cols-3 sm-525:gap-6 lg:gap-8 xl:grid-cols-4">
          {products.map((product) => {
            const isAvailable = (product.stock ?? 0) > 0;
            const productColors = getProductColors(product);

            return (
              <div
                key={product.id}
                className="p-5 transition transform bg-black md:p-4 lg:p-6 rounded-2xl group hover:scale-105"
              >
                <div
                  className="flex justify-center bg-[#262626cc] rounded-xl group-hover:bg-[#8d97bd3f] cursor-pointer p-1"
                  onClick={() =>
                    navigate(`/products/view-product-details/${product.id}`)
                  }
                >
                  <img
                    src={product.productImage || "/placeholder.png"}
                    alt={`Product ${product.id}`}
                    className="object-cover w-auto h-40 rounded-lg lg:h-44 xl:h-60"
                  />
                </div>
                <div className="mt-2.5 md:mt-3 text-left">
                  <p className="font-semibold text-[#ffff66] capitalize text-base md:text-lg">
                    {product.name}
                  </p>
                  
                  {/* Product Description */}
                  {product.description && (
                    <p className="mt-1 text-xs leading-relaxed text-gray-300">
                      {truncateText(product.description, 80)}
                    </p>
                  )}
                  
                  {/* Category */}
                  {product.category && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 text-xs text-white bg-blue-600 rounded">
                        {product.category.name}
                      </span>
                    </div>
                  )}

                  {/* Multiple Colors Display */}
                  {productColors && productColors.length > 0 && (
                    <div className="mt-2">
                      <p className="mb-1 text-xs text-gray-300">
                        Colors ({productColors.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {productColors.slice(0, 4).map((color, index) => (
                          <span 
                            key={`${product.id}-color-${color?.id || index}-${index}`}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded bg-purple-600/80"
                            title={color?.name || 'Color'}
                          >
                            {color?.hexCode && (
                              <div
                                className="w-3 h-3 border border-white rounded-full"
                                style={{ backgroundColor: color.hexCode }}
                              ></div>
                            )}
                            <span className="truncate max-w-[60px]">
                              {color?.name || 'Unnamed'}
                            </span>
                          </span>
                        ))}
                        {productColors.length > 4 && (
                          <span className="flex items-center px-2 py-1 text-xs text-gray-300 rounded bg-gray-600/80">
                            +{productColors.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Paint-specific info */}
                  <div className="mt-2 space-y-0.5">
                    {product.finish && (
                      <p className="text-sm font-thin text-white">
                        Finish: {product.finish}
                      </p>
                    )}
                    {product.volume && (
                      <p className="text-sm font-thin text-white">
                        Volume: {product.volume}L
                      </p>
                    )}
                    {product.coverage && (
                      <p className="text-sm font-thin text-white">
                        Coverage: {product.coverage}
                      </p>
                    )}
                    {product.dryingTime && (
                      <p className="text-sm font-thin text-white">
                        Drying: {product.dryingTime}
                      </p>
                    )}
                    {product.coats && (
                      <p className="text-sm font-thin text-white">
                        Coats: {product.coats}
                      </p>
                    )}
                  </div>
                  
                  <p className="mt-2 text-base font-bold text-gray-200">
                    Rs. {product.price}
                  </p>
                  
                  <p
                    className={`text-sm font-medium ${
                      isAvailable ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isAvailable
                      ? `Available (${product.stock} in stock)`
                      : "Out of Stock"}
                  </p>
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    className="flex items-center justify-center text-white transition bg-green-600 rounded-full shadow-lg w-9 h-9 hover:bg-green-500"
                    onClick={() =>
                      navigate(`/products/add-products`, { state: { product } })
                    }
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    className="flex items-center justify-center text-white transition bg-red-600 rounded-full shadow-lg w-9 h-9 hover:bg-red-500"
                    onClick={() => openDeleteModal(product.id)}
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="p-6 bg-[#262626] rounded-xl w-[340px]  sm-425:w-[380px]">
            <h2 className="text-xl font-semibold text-white">
              Confirm Deletion
            </h2>
            <p className="mt-5 text-sm text-gray-300 md:text-base">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end mt-5 space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-1.5 text-sm md:text-base text-white bg-gray-500 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-6 py-1.5 text-sm md:text-base text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;