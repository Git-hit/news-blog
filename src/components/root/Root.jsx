"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import NotificationsMarquee from "./notificationsMarquee";

const FeaturePostFinder = (data) => {
  const featuredPosts = data.filter((item) => item.featured === true);

  if (featuredPosts.length > 0) {
    return { hasFeatured: true, posts: featuredPosts };
  }

  const sortedByCreatedAt = [...data].sort((a, b) => {
    const dateA = DateTime.fromISO(a.created_at);
    const dateB = DateTime.fromISO(b.created_at);
    return dateB.toMillis() - dateA.toMillis();
  });

  return { hasFeatured: false, posts: sortedByCreatedAt.slice(0, 1) };
};

const Root = ({ mainNews }) => {
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
      })
      .catch((err) => console.error("Failed to fetch notifications", err));
  }, []);

  // Use fetched data or fallback
  const newsToUse = mainNews.length > 0 ? mainNews : [];

  // Find featured or latest post(s)
  const { posts: featuredOrLatestPosts } = FeaturePostFinder(newsToUse);

  // Get IDs of featured/latest posts to exclude from side news
  const featuredOrLatestIds = new Set(featuredOrLatestPosts.map((p) => p.id));

  // Side news = all news excluding featured/latest
  const sideNews = newsToUse
    .filter((post) => !featuredOrLatestIds.has(post.id))
    // Optional: sort side news by date descending
    .sort((a, b) => {
      const dateA = DateTime.fromISO(a.created_at);
      const dateB = DateTime.fromISO(b.created_at);
      return dateB.toMillis() - dateA.toMillis();
    });

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
    <div className="px-4 py-6">
      {/* Marquee Bar */}
      <NotificationsMarquee notifications={notifications} router={router} />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:mx-20">
        {/* Left Main News */}
        <div className="lg:col-span-2 relative">
          {featuredOrLatestPosts.map((item) => (
            <div
              onClick={() => router.push(`/post/${item.slug}`)}
              key={item.id}
              className="relative h-96 cursor-pointer rounded-lg overflow-hidden mb-6"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.image}`}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 p-5 rounded max-w-md">
                <h2 className="text-xl font-bold leading-tight mb-2">
                  {item.title}
                </h2>
                {/* {item.meta_description && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {item.meta_description}
                  </p>
                )} */}
                <p className="text-xs text-gray-400 mt-2">
                  {formatPosted(item.created_at)} • Read More
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side News */}
        <div className="space-y-5">
          {sideNews.length > 0 ? (
            sideNews.slice(1, 5).map((item) => {
              const categoriesText = () => {
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
              };
              return (
                <div
                  onClick={() => router.push(`/post/${item.slug}`)}
                  key={item.id}
                  className="flex space-x-4 cursor-pointer"
                >
                  <div className="w-24 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.image}` ||
                        "/logo1.jpg"
                      }
                      alt={item.title}
                      width={96}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="text-xs text-red-500 font-semibold">
                      {categoriesText()}
                    </div>
                    <h3 className="text-sm font-bold leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-xs text-gray-500">
                      {/* {DateTime.fromISO(item.created_at).toRelative()} */}
                      {formatPosted(item.created_at)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No other news available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Root;