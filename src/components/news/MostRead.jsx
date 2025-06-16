"use client";

import React from "react";
import Image from "next/image";
import { DateTime } from "luxon";

const normalize = (str) =>
  str.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim();

const MostRead = ({ mostReadData, category }) => {
  const normalizedCategory = normalize(category);

  // Filter by category
  const filtered = mostReadData.filter((item) => {
    try {
      const cats = item.categories;
      if (Array.isArray(cats)) {
        return cats.some((cat) => normalize(cat) === normalizedCategory);
      }
      return false;
    } catch (e) {
      return false;
    }
  });

  // Check if all items have views, and sort by views descending
  let sorted = [...filtered];
  const hasViews = sorted.some((item) => typeof item.views === "number");

  // console.log(sorted)

  if (hasViews) {
    sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    sorted.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  if (sorted.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold">No most read articles</h2>
      </section>
    );
  }

  const [mainStory, ...sideStories] = sorted;

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
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Must Read</h2>
        {/* <button className="text-red-500 text-sm font-medium hover:underline">
          See all
        </button> */}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Featured Article */}
        <div
          // onClick={() => router.push(`/post/${mainStory.slug}`)} 
          className="cursor-pointer bg-white rounded-xl shadow overflow-hidden flex flex-col md:flex-row"
        >
          <a href={`/post/${mainStory.slug}`}>
            <img
              src={`${mainStory.image}`}
              alt={mainStory.title}
              // width={400}
              // height={250}
              className="object-cover w-full md:h-auto"
            />
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  {/* <span className="font-medium text-black">
                  {mainStory.author}
                  </span>
                <span>•</span> */}
                  <span>{formatPosted(mainStory.created_at)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {mainStory.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {mainStory.meta_description}
                </p>
              </div>
              <div className="text-xs text-red-500 font-medium">
                {(() => {
                  if (!mainStory.categories) return "General";
                  try {
                    const cats = JSON.parse(mainStory.categories);
                    if (Array.isArray(cats) && cats.length > 0) {
                      return cats.join(", ");
                    } else {
                      return "General";
                    }
                  } catch {
                    return mainStory.categories || "General";
                  }
                })()}
                {/* • {mainStory.readTime} */}
              </div>
            </div>
          </a>
        </div>

        {/* Side Articles */}
        <div className="space-y-4">
          {sideStories.slice(0, 3).map((item) => (
            <div
              // onClick={() => router.push(`/post/${item.slug}`)}
              key={item.id}
              className="cursor-pointer flex items-start space-x-4 bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <a>
                <Image
                  src={`${item.image}`}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover w-20 h-20"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                    {item.title}
                  </h4>
                  {/* <div className="mt-1 text-xs text-gray-500">
                  {item.author} • {item.timeAgo}
                </div> */}
                  <div className="text-xs text-red-500 mt-1">
                    {(() => {
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
                    })()}
                    {/* • {item.readTime} */}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostRead;