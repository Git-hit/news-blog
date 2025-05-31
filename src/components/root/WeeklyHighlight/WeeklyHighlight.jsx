"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import React from "react";

// Function to extract top 4 most viewed posts
const WeeklyPostFinder = (data) => {
  return data
    .sort((a, b) => parseInt(b.views) - parseInt(a.views))
    .slice(0, 4);
};

// Sample data with `views`
const weeklyHighlights = [
  {
    id: 1,
    image: "/Logo1.jpg",
    title: "People spend night on roofs and in trees after Ukraine dam breach",
    author: "Formula1",
    timeAgo: "5 days ago",
    category: "Sport",
    readTime: "1 min read",
    views: "5600",
  },
  {
    id: 2,
    image: "/Logo1.jpg",
    title:
      "How legal immigration might solve two of America’s toughest problems",
    author: "BBC News",
    timeAgo: "10 hours ago",
    category: "Politics",
    readTime: "1 min read",
    views: "12000",
  },
  {
    id: 3,
    image: "/Logo1.jpg",
    title: "North Korea hackers suspected in new $35 million crypto heist",
    author: "Nina Waters",
    timeAgo: "10 hours ago",
    category: "Business",
    readTime: "1 min read",
    views: "8600",
  },
  {
    id: 4,
    image: "/Logo1.jpg",
    title:
      "They said we were getting a recession. Instead, we’re getting close to a bull market",
    author: "Jamar Burns",
    timeAgo: "10 hours ago",
    category: "War",
    readTime: "1 min read",
    views: "7400",
  },
  {
    id: 5,
    image: "/Logo1.jpg",
    title: "Another popular news item to test sorting",
    author: "Reuters",
    timeAgo: "2 hours ago",
    category: "Economy",
    readTime: "2 min read",
    views: "9200",
  },
];

const WeeklyHighlight = () => {
  const topPosts = WeeklyPostFinder(weeklyHighlights);

  return (
    <div className='px-4 py-10 lg:mx-20'>
      {/* Header */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Weekly Highlight</h2>
        {/* <div className='flex items-center text-red-600 font-semibold cursor-pointer'>
          <span>See all</span>
          <ArrowRight className='ml-1 w-4 h-4' />
        </div> */}
      </div>

      {/* Highlights Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {topPosts.map((item) => (
          <div key={item.id} className='space-y-2'>
            <div className='rounded-xl overflow-hidden'>
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={200}
                className='w-full h-40 object-cover'
              />
            </div>
            <h3 className='text-sm font-semibold leading-tight line-clamp-2'>
              {item.title}
            </h3>
            <div className="flex justify-between">
              <p className='text-xs text-red-600'>
                {item.category} • {item.readTime}
              </p>
              <div className='text-xs text-gray-500'>{item.timeAgo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyHighlight;