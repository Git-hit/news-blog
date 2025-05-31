"use client";
import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";

const normalize = (str) =>
  str.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim();

const TopNews = ({ topNewsData, category }) => {
  const router = useRouter();
  const normalizedCategory = normalize(category);

  // Filter by category
  const categoryFiltered = topNewsData
    .filter((item) => {
      try {
        const categoriesArray = JSON.parse(item.categories);
        return categoriesArray.some(
          (cat) => normalize(cat) === normalizedCategory
        );
      } catch (e) {
        return false;
      }
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  // Try to get only featured posts first
  const featuredFiltered = categoryFiltered.filter((item) => item.featured === true);

  const finalPosts = featuredFiltered.length > 0 ? featuredFiltered : categoryFiltered;

  if (finalPosts.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold">No news in this category</h2>
      </section>
    );
  }

  const [mainStory, ...rest] = finalPosts;
  const sideStories = rest.slice(0, 4);

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
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize">{category.replace(/-/g, " ")}</h2>
        <a href="#" className="text-sm text-red-600 font-medium hover:underline">
          See all →
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Story */}
        <div onClick={() => router.push(`/post/${mainStory.slug}`)} className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm">
          <Image
            src={`http://localhost:8000/storage/${mainStory.image}`}
            alt={mainStory.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              {formatPosted(mainStory.created_at)}
            </div>
            <h3 className="text-xl font-semibold mb-2">{mainStory.title}</h3>
            <p className="text-sm text-gray-700 line-clamp-3">{mainStory.meta_description}</p>
            <div className="flex items-center text-xs text-red-600 mt-3">
              <span>{category.replace(/-/g, " ")}</span>
            </div>
          </div>
        </div>

        {/* Side Stories */}
        <div className="flex flex-col space-y-5">
          {sideStories.map((item) => (
            <div onClick={() => router.push(`/post/${item.slug}`)} key={item.id} className="cursor-pointer flex items-start space-x-4">
              <Image
                src={`http://localhost:8000/storage/${item.image}`}
                alt={item.title}
                width={100}
                height={100}
                className="w-24 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                  {formatPosted(item.created_at)}
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center text-xs text-red-600">
                  <span>{category.replace(/-/g, " ")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopNews;