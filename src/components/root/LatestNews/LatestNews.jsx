"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";

const LatestNews = ({ news }) => {
  const router = useRouter();

  // Sort by created_at descending and take top 3
  const latestPosts = [...news]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  // Format created_at to "x hours ago" or date string
  const formatPosted = (dateString) => {
    if (!dateString) return "";
    const dt = DateTime.fromISO(dateString);
    const now = DateTime.now();
    const diff = now.diff(dt, ["hours", "days"]);
    if (diff.days >= 1) return dt.toFormat("LLL dd, yyyy");
    if (diff.hours >= 1) return `${Math.floor(diff.hours)} hours ago`;
    return "Just now";
  };

  return (
    <div className="px-5 lg:px-20 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Latest News</h2>
        {/* <div className="text-red-500 flex items-center cursor-pointer hover:underline">
          <span>See all</span>
          <ArrowRight className="ml-1 w-4 h-4" />
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestPosts.map((item) => {
          const categoriesText = (() => {
            if (!item.categories) return "General";
            try {
              const cats = JSON.parse(item.categories);
              if (Array.isArray(cats) && cats.length > 0) {
                return cats.join(", ");
              } else {
                return "General";
              }
            } catch {
              return item.categories || "General";
            }
          })();

          return (
            <div
              onClick={() => router.push(`/post/${item.slug}`)}
              key={item.id}
              className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              {item.image ? (
                <Image
                  src={`${process.env.API_URL}/storage/${item.image}`}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="w-full h-52 object-cover"
                />
              ) : (
                <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="flex items-center text-sm text-gray-600 space-x-2 mb-2">
                  <span className="font-semibold">{categoriesText}</span>
                  <span>•</span>
                  <span>{formatPosted(item.created_at)}</span>
                </div>
                <h3 className="text-lg font-semibold mb-4">{item.title}</h3>
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="text-red-600 font-medium">
                    {categoriesText}
                  </span>
                  {/* <span>1 min read</span> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatestNews;