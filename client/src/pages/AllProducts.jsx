import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'
import { assets } from '../assets/assets'

const AllProducts = () => {
  const { products, searchQuery, isLoading } = useAppContext()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    inStock: false,
  });

  const applyFilters = () => {
    let tempProducts = [...(products || [])];

    // 1. Search Query
    if (searchQuery && searchQuery.length > 0) {
      tempProducts = tempProducts.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Category
    if (filters.category !== "all") {
      tempProducts = tempProducts.filter(item =>
        item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // 3. Price Range
    if (filters.minPrice) {
      tempProducts = tempProducts.filter(item => item.offerPrice >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      tempProducts = tempProducts.filter(item => item.offerPrice <= Number(filters.maxPrice));
    }

    // 4. In Stock
    if (filters.inStock) {
      tempProducts = tempProducts.filter(item => item.inStock);
    }

    // 5. Sorting
    switch (filters.sort) {
      case "price_low":
        tempProducts.sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case "price_high":
        tempProducts.sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      case "name_asc":
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
      default:
        tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(tempProducts);
  };

  useEffect(() => {
    if (products && products.length >= 0) {
      applyFilters();
    }
  }, [products, searchQuery, filters]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Initial render safety
  if (!products) return <div className="mt-20 text-center text-gray-600 dark:text-gray-400">Loading products...</div>;

  return (
    <div className='mt-8 flex flex-col lg:flex-row gap-8'>
      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={setFilters}
      />

      <div className='flex-1'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex flex-col items-start'>
            <p className='text-2xl font-medium uppercase text-gray-800 dark:text-white'>All Products</p>
            <div className='w-16 h-0.5 bg-primary rounded-full mt-1'></div>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className='lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-200'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className='text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl'>
            <div className='text-4xl mb-4'>🔍</div>
            <h3 className='text-lg font-medium text-gray-700 dark:text-gray-200'>No products found</h3>
            <p className='text-gray-500 dark:text-gray-400'>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProducts

