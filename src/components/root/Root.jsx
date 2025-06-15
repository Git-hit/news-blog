"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import NotificationsMarquee from "./notificationsMarquee";
import Link from "next/link";

const FeaturePostFinder = (data) => {
  const featuredPosts = data.filter((item) => item.featured === true);

  // Sort by latest
  const sortedFeatured = [...featuredPosts].sort((a, b) => {
    const dateA = DateTime.fromISO(a.created_at);
    const dateB = DateTime.fromISO(b.created_at);
    return dateB.toMillis() - dateA.toMillis();
  });

  if (sortedFeatured.length > 0) {
    const mainPost = sortedFeatured[0];
    const sidePosts = sortedFeatured.slice(1, 5);
    return { mainPost, sidePosts };
  }

  // If no featured posts, fall back to latest
  const sortedByCreatedAt = [...data].sort((a, b) => {
    const dateA = DateTime.fromISO(a.created_at);
    const dateB = DateTime.fromISO(b.created_at);
    return dateB.toMillis() - dateA.toMillis();
  });

  return { mainPost: sortedByCreatedAt[0], sidePosts: sortedByCreatedAt.slice(1, 5) };
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
  const { mainPost, sidePosts } = FeaturePostFinder(newsToUse);


  // Get IDs of featured/latest posts to exclude from side news
  const featuredOrLatestIds = new Set([mainPost?.id, ...sidePosts.map(p => p.id)]);

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
          {mainPost && (
            <div
              // onClick={() => router.push(`/post/${mainPost.slug}`)}
              className="relative h-96 cursor-pointer rounded-lg overflow-hidden mb-6"
            >
              <Link href={`/post/${mainPost.slug}`}>
                <Image
                  src={`${mainPost.image}`}
                  alt={mainPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 p-5 rounded max-w-md">
                  <h2 className="text-xl font-bold leading-tight mb-2">
                    {mainPost.title}
                  </h2>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatPosted(mainPost.created_at)} • Read More
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Right Side News */}
        <div className="space-y-5">
          {sidePosts.length > 0 ? (
            sidePosts.map((item) => {
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
                <Link
                  // onClick={() => router.push(`/post/${item.slug}`)}
                  href={`/post/${item.slug}`}
                  key={item.id}
                  className="flex space-x-4 cursor-pointer"
                >
                  <div className="w-24 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        `${item.image}` ||
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
                </Link>
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