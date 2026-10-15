import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm animate-pulse">
      {/* 4:3 image skeleton */}
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="w-16 h-3 bg-stone-200 rounded" />
        <div className="w-3/4 h-5 bg-stone-200 rounded" />
        <div className="w-1/2 h-6 bg-stone-200 rounded" />
        <div className="w-2/3 h-3 bg-stone-200 rounded" />
      </div>
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <div className="h-11 bg-stone-200 rounded-xl" />
        <div className="h-11 bg-stone-200 rounded-xl" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="w-full aspect-[4/3] bg-stone-200 rounded-2xl" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-20 bg-stone-200 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-5">
          <div className="w-24 h-4 bg-stone-200 rounded" />
          <div className="w-3/4 h-8 bg-stone-200 rounded" />
          <div className="w-1/2 h-10 bg-stone-200 rounded" />
          <div className="h-32 bg-stone-200 rounded-2xl" />
          <div className="h-40 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function TicketSkeleton() {
  return (
    <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-32 h-6 bg-stone-200 rounded" />
        <div className="w-24 h-6 bg-stone-200 rounded-full" />
      </div>
      <div className="w-48 h-5 bg-stone-200 rounded" />
      <div className="w-full h-12 bg-stone-200 rounded-xl" />
      <div className="w-full h-16 bg-stone-100 rounded-xl" />
    </div>
  );
}
