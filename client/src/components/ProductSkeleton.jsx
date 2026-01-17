import React from "react";

const ProductSkeleton = () => {
    return (
        <div className="border border-gray-200 rounded-lg p-3 animate-pulse">
            {/* Image Skeleton */}
            <div className="bg-gray-200 rounded-lg h-40 w-full mb-3"></div>

            {/* Title Skeleton */}
            <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>

            {/* Category Skeleton */}
            <div className="bg-gray-200 rounded h-3 w-1/2 mb-3"></div>

            {/* Price Skeleton */}
            <div className="flex items-center gap-2">
                <div className="bg-gray-200 rounded h-5 w-16"></div>
                <div className="bg-gray-200 rounded h-4 w-12"></div>
            </div>

            {/* Button Skeleton */}
            <div className="bg-gray-200 rounded-full h-8 w-full mt-3"></div>
        </div>
    );
};

// Multiple skeletons for grid
export const ProductSkeletonGrid = ({ count = 6 }) => {
    return (
        <>
            {Array(count)
                .fill(null)
                .map((_, index) => (
                    <ProductSkeleton key={index} />
                ))}
        </>
    );
};

export default ProductSkeleton;
