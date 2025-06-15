"use client";
import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

const MoreToExplore = ({ exploreData, category }) => {
  const router = useRouter();
  const filtered = exploreData.filter((item) => {
    try {
      const parsed = JSON.parse(item.categories);
      return parsed.some((cat) => slugify(cat) === category.toLowerCase());
    } catch (e) {
      return false;
    }
  });

  const latestFour = filtered.slice(0, 4);

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
      <h2 className="text-3xl font-bold text-gray-900 mb-8">More to Explore</h2>

      {latestFour.length === 0 ? (
        <p className="text-gray-600">No news in this category.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {latestFour.map((item) => (
            <div
              // onClick={() => router.push(`/post/${item.slug}`)}
              key={item.id}
              className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <a>
                <Image
                  src={`${item.image}`}
                  alt={item.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <span className="text-sm text-red-500 font-medium mb-2 block">
                    {/* {JSON.parse(item.categories)[0]} */}
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
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {item.meta_description}
                  </p>
                  <div className="flex items-center text-xs text-gray-400">
                    {/* <Clock className="w-4 h-4 mr-1" /> */}
                    {/* <span>{item.readTime}</span>
                  <span className="mx-2">•</span> */}
                    {/* <span>{item.time}</span> */}
                    {formatPosted(item.created_at)}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MoreToExplore;