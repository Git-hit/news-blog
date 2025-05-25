"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import React from "react";
import { DateTime } from "luxon";

// Interface
interface MustReadItem {
  id: number;
  image: string;
  title: string;
  author: string;
  timeAgo: string;
  description?: string;
  category: string;
  readTime: string;
  mustRead?: boolean;
}

// Sample data
const mustReadData: MustReadItem[] = [
  {
    id: 1,
    image: "/Logo1.jpg",
    title:
      "Félicien Kabuga: Rwanda genocide suspect unfit to stand trial, UN court rules",
    author: "Jack Herleem",
    timeAgo: "10 hours ago",
    description:
      "About 85% of Rwandans are Hutus but the Tutsi minority has long dominated the country...",
    category: "Disaster",
    readTime: "1 min read",
    mustRead: true,
  },
  {
    id: 2,
    image: "/Logo1.jpg",
    title:
      "Stella explains what 'instrumental' Rob Marshall will bring to McLaren in 2024",
    author: "Oliver Grey",
    timeAgo: "5 hours ago",
    category: "Sport",
    readTime: "5 min read",
    mustRead: true,
  },
  {
    id: 3,
    image: "/Logo1.jpg",
    title: "Pope Francis undergoes abdominal surgery in latest health concern",
    author: "Ray Craig",
    timeAgo: "2 hours ago",
    category: "World",
    readTime: "3 min read",
  },
  {
    id: 4,
    image: "/Logo1.jpg",
    title:
      "Fact check: Trump boasts about a massive oil purchase that never happened",
    author: "Raine Warner",
    timeAgo: "5 hours ago",
    category: "Politics",
    readTime: "5 min read",
    mustRead: true,
  },
  {
    id: 5,
    image: "/Logo1.jpg",
    title:
      "India launches new space mission to study solar corona from close orbit",
    author: "Kiran Patel",
    timeAgo: "1 hour ago",
    category: "Science",
    readTime: "2 min read",
  },
];

// Converts "5 hours ago" → DateTime
const parseTimeAgo = (timeAgo: string): DateTime => {
  const [value, unitRaw] = timeAgo.split(" ");
  const unit = unitRaw.replace(/s$/, "");
  return DateTime.now().minus({ [unit]: parseInt(value, 10) });
};

// Choose posts to display
const getDisplayPosts = (data: MustReadItem[]): MustReadItem[] => {
  const mustReadPosts = data.filter((item) => item.mustRead);
  if (mustReadPosts.length >= 4) {
    return mustReadPosts.slice(0, 4);
  }
  return [...data]
    .sort(
      (a, b) =>
        parseTimeAgo(a.timeAgo).toMillis() - parseTimeAgo(b.timeAgo).toMillis()
    )
    .slice(0, 4);
};

const MustRead = () => {
  const postsToDisplay = getDisplayPosts(mustReadData);

  return (
    <div className="px-4 py-10 lg:mx-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Must Read</h2>
        <div className="flex items-center text-red-600 font-semibold cursor-pointer">
          <span>See all</span>
          <ArrowRight className="ml-1 w-4 h-4" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Highlight */}
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden">
            <Image
              src={postsToDisplay[0].image}
              alt={postsToDisplay[0].title}
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold mt-1">{postsToDisplay[0].title}</h3>
            {postsToDisplay[0].description && (
              <p className="text-sm text-gray-600 mt-1">
                {postsToDisplay[0].description}
              </p>
            )}
            <p className="text-xs text-red-600 mt-2">
              {postsToDisplay[0].category} • {postsToDisplay[0].readTime}
            </p>
          </div>
        </div>

        {/* Side List */}
        <div className="space-y-5">
          {postsToDisplay.slice(1).map((item) => (
            <div key={item.id} className="flex space-x-3">
              <div className="w-28 h-20 overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={112}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <h4 className="text-sm font-semibold leading-tight line-clamp-3">
                  {item.title}
                </h4>
                <div className="flex justify-between">
                  <div className="text-xs text-red-600">
                    {item.category} • {item.readTime}
                  </div>
                  <div className="text-xs text-gray-500">{item.timeAgo}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MustRead;