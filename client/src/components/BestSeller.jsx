import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { ProductSkeletonGrid } from "./ProductSkeleton";

const BestSeller = () => {
  const { products, isLoading } = useAppContext();

  return (
    <div className="mt-16 ">
      <p className="text-2xl md:text-3xl font-medium mb-6 text-gray-800 dark:text-white">Best Seller</p>

      {/* Grid Layout */}
      <div className="grid grid-cols-2  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {isLoading ? (
          <ProductSkeletonGrid count={6} />
        ) : (
          products.slice(0, 6).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default BestSeller;
