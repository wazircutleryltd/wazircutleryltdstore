'use client';
import React from 'react';

const ProductSkeleton = ({ count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="card-border p-6 flex flex-col h-full animate-pulse">
                    <div className="relative mb-4">
                        <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                        </div>
                    </div>

                    {/* Title Skeleton */}
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

                    {/* Rating Skeleton */}
                    <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        ))}
                    </div>

                    {/* Price Skeleton */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/5"></div>
                    </div>

                    {/* Delivery Text Skeleton */}
                    <div className="h-4 bg-gray-100 rounded w-full mb-4"></div>

                    {/* Button Skeleton */}
                    <div className="h-10 bg-gray-200 rounded-md w-full mt-2"></div>
                </div>
            ))}
        </>
    );
};

export default ProductSkeleton;
