import { Product } from "@/types/ProductType";
import { showToastinfo } from "@/utils/toast/infoToast";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoCartOutline, IoFilterOutline, IoGridOutline, IoListOutline, IoHeartOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  _count: { products: number };
}

const ITEMS_PER_PAGE = 12;

export default function EShop() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch categories
  const fetchFiltersData = async () => {
    try {
      const categoriesRes = await axios.get("http://localhost:5000/api/categories");
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching filters data:", error);
    }
  };

  // Fetch products with filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory) params.append('categoryId', selectedCategory.toString());
      params.append('skip', ((currentPage - 1) * ITEMS_PER_PAGE).toString());
      params.append('take', ITEMS_PER_PAGE.toString());

      const response = await axios.get(`http://localhost:5000/api/products?${params}`);
      
      let productsData = response.data.data || response.data;
      setTotalProducts(response.data.count || productsData.length);
      
      // Apply search filter
      if (searchTerm.trim()) {
        productsData = productsData.filter((product: Product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply price filter
      productsData = productsData.filter((product: Product) =>
        Number(product.price) >= priceRange.min && Number(product.price) <= priceRange.max
      );
      
      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          productsData.sort((a: Product, b: Product) => Number(a.price) - Number(b.price));
          break;
        case 'price-high':
          productsData.sort((a: Product, b: Product) => Number(b.price) - Number(a.price));
          break;
        case 'name':
          productsData.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
          break;
        case 'newest':
        default:
          // Already sorted by createdAt desc from backend
          break;
      }
      
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToastinfo("Error loading products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setIsLogin(!!token);
    fetchFiltersData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = !searchTerm.trim() || 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = Number(product.price) >= priceRange.min && Number(product.price) <= priceRange.max;
      return matchesSearch && matchesPrice;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products, priceRange]);

  // Updated function to navigate to product details
  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange({ min: 0, max: 10000 });
    setSearchTerm("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative z-0 top-0 left-0 bg-center bg-cover w-full h-[380px] sm-525:h-[350px] lg:h-[400px] bg-[url('/client/product/k.webp')]">
        <div className="flex w-full h-full items-center justify-center bg-black bg-opacity-60 backdrop-blur-[1px]">
          <div className="mt-16 text-center md:mt-24">
            <h1 className="text-3xl sm:text-[56px] lg:text-[72px] font-bold text-white capitalize tracking-wide">
              Premium E-Shop
            </h1>
            <p className="text-white sm:text-base md:text-xl w-full lg:w-[900px] xl:w-[1200px] px-5 sm:px-8 lg:px-10 leading-relaxed mt-5 sm:mt-8 lg:mt-12">
              Discover our premium collection of sustainable plastering solutions. 
              Professional-grade products for your construction and renovation needs.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-5 mx-auto my-8 sm:px-8 xl:px-10 max-w-7xl">
        {/* Search and Controls Bar */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <IoGridOutline size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <IoListOutline size={20} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <IoFilterOutline />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white rounded-lg shadow-sm p-6 h-fit`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 transition hover:text-blue-700"
              >
                Clear All
              </button>
            </div>

            {/* Categories Filter */}
            <div className="mb-6">
              <h4 className="mb-3 font-medium text-gray-800">Categories</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === null}
                    onChange={() => setSelectedCategory(null)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">All Categories</span>
                </label>
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </div>
                    <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
                      {category._count.products}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="mb-3 font-medium text-gray-800">Price Range</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 10000 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  LKR {priceRange.min} - LKR {priceRange.max}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {totalProducts} products
              </p>
              {(selectedCategory || searchTerm) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <MdClose 
                        className="rounded-full cursor-pointer hover:bg-blue-200"
                        onClick={() => setSelectedCategory(null)}
                      />
                    </span>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'}`}
                >
                  {filteredProducts.map((product) => (
                    <div key={product.id} className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}>
                      <div 
                        className={`${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} relative overflow-hidden bg-gray-50`}
                        onClick={() => handleProductClick(product)}
                      >
                        {/* Heart Icon - positioned absolutely in top-right */}
                        <button 
                          className="absolute z-10 p-2 transition-all duration-200 bg-white rounded-full shadow-sm top-3 right-3 hover:shadow-md group-hover:bg-gray-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IoHeartOutline size={16} className="text-gray-600 hover:text-red-500" />
                        </button>
                        
                        <img
                          src={product.productImage}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-300 cursor-pointer group-hover:scale-105"
                        />
                        {(product.stock ?? 0) === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <span className="font-semibold text-white">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="mb-3 cursor-pointer" onClick={() => handleProductClick(product)}>
                          <h3 className="font-semibold text-center text-gray-800 transition hover:text-blue-600 line-clamp-2">
                            {product.name}
                          </h3>
                        </div>
                        
                        <div className="space-y-3 text-center">
                          <div>
                            <p className="mb-1 text-sm text-gray-500">From</p>
                            <p className="text-xl font-bold text-gray-800">
                              LKR {product.price.toLocaleString()}
                            </p>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product);
                            }}
                            disabled={(product.stock ?? 0) === 0}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                              (product.stock ?? 0) > 0
                                ? "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white"
                                : "bg-gray-400 text-gray-600 cursor-not-allowed border-2 border-gray-400"
                            }`}
                          >
                            {(product.stock ?? 0) > 0 ? "SHOP NOW" : "OUT OF STOCK"}
                          </button>
                          
                          <p className={`text-sm ${
                            (product.stock ?? 0) > 0 ? "text-green-600" : "text-red-500"
                          }`}>
                            {(product.stock ?? 0) > 0 
                              ? `${product.stock} in stock` 
                              : "Out of stock"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="mb-4 text-6xl text-gray-300">🔍</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No products found</h3>
                <p className="mb-4 text-gray-600">
                  {searchTerm || selectedCategory
                    ? "Try adjusting your filters or search terms"
                    : "No products are currently available"}
                </p>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}