/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Image from "next/image";
import { DateTime } from "luxon";

interface NewsItem {
  id: string;
  title: string;
}

const demoNews: NewsItem[] = [
  { id: "1", title: "Ukrainian troops saw Russian soldiers swept away" },
  {
    id: "2",
    title: "Philadelphia under 'code red' alert as militias from US East Coast",
  },
  { id: "3", title: "Turkish lira crashes as inflation surges" },
];

interface NewsItem2 {
  id: number;
  logo: string;
  postedBy: string;
  posted: string;
  title: string;
  para: string;
  postedOn: string; // "Aug 03, 2023"
  backgroundImage: string;
  featured?: boolean;
}

// Function to extract featured or latest post
const FeaturePostFinder = (data: NewsItem2[]) => {
  const featuredPosts = data.filter((item) => item.featured === true);

  if (featuredPosts.length > 0) {
    return { hasFeatured: true, posts: featuredPosts };
  }

  const sortedByDate = [...data].sort((a, b) => {
    const dateA = DateTime.fromFormat(a.postedOn, "LLL dd, yyyy");
    const dateB = DateTime.fromFormat(b.postedOn, "LLL dd, yyyy");
    return dateB.toMillis() - dateA.toMillis(); // Latest first
  });

  return { hasFeatured: false, posts: sortedByDate.slice(0, 1) };
};

const MainNews: NewsItem2[] = [
  {
    id: 1,
    logo: "/logo.png",
    postedBy: "BBC News",
    posted: "13 mins ago",
    title: "People spend night on roofs and in trees after Ukraine dam breach",
    para: "Hundreds of thousands of people have been left without access to clean water since the breach of the Kakhovka dam.",
    postedOn: "Aug 03, 2023",
    backgroundImage: "/logo1.jpg",
    featured: false,
  },
  {
    id: 2,
    logo: "/logo.png",
    postedBy: "CNN News",
    posted: "5 mins ago",
    title: "Turkish lira crashes as inflation surges",
    para: "Turkey’s currency continues its free fall amid inflation fears.",
    postedOn: "Aug 10, 2023",
    backgroundImage: "/logo1.jpg",
    featured: true,
  },
];

interface NewsItem3 {
  id: number;
  logo: string;
  postedBY: string;
  posted: string;
  title: string;
  type: string;
  timeToRead: string;
}

const sideNews: NewsItem3[] = [
  {
    id: 1,
    logo: "/logo1.jpg",
    postedBY: "CNN News",
    posted: "1 hour ago",
    title: "CNN Chairman and CEO Chris Licht is out",
    type: "Business",
    timeToRead: "2 min read",
  },
  {
    id: 2,
    logo: "/logo1.jpg",
    postedBY: "BBC News",
    posted: "5 min read",
    title: "What Turkey’s new cabinet says about where country is headed",
    type: "World",
    timeToRead: "5 min read",
  },
  {
    id: 3,
    logo: "/logo1.jpg",
    postedBY: "BBC News",
    posted: "2 hours ago",
    title: "This country has the best wines in the world for 2023",
    type: "Food & Drink",
    timeToRead: "3 min read",
  },
  {
    id: 4,
    logo: "/logo1.jpg",
    postedBY: "CNN News",
    posted: "2 min read",
    title: "The double-decker airplane seat is back. Here’s what it looks like now",
    type: "World",
    timeToRead: "2 min read",
  },
];

const Root = () => {
  const { hasFeatured, posts } = FeaturePostFinder(MainNews);

  return (
    <div className='px-4 py-6'>
      {/* Marquee Bar */}
      <div className='relative bg-gray-100 border border-gray-300 py-2 px-4 overflow-hidden rounded mb-6'>
        <span className='absolute left-4 top-2 text-red-600 font-semibold z-10 bg-gray-100 px-2'>
          News Update:
        </span>
        <div className='pl-32 overflow-hidden whitespace-nowrap'>
          <div className='inline-block animate-marquee'>
            {demoNews.concat(demoNews).map((item, idx) => (
              <span
                key={`${item.id}-${idx}`}
                className='inline-flex items-center space-x-3 mr-10 text-sm'>
                <span>{item.title}</span>
                <span className='text-red-500 font-bold text-lg leading-none'>
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:mx-20'>
        {/* Left Main News */}
        <div className='lg:col-span-2 relative'>
          {posts.map((item) => (
            <div
              key={item.id}
              className='relative h-96 rounded-lg overflow-hidden'>
              <Image
                src={item.backgroundImage}
                alt={item.title}
                fill
                className='object-cover'
              />
              <div className='absolute bottom-6 left-6 bg-white bg-opacity-90 p-5 rounded max-w-md'>
                <h2 className='text-xl font-bold leading-tight mb-2'>
                  {item.title}
                </h2>
                <p className='text-sm text-gray-700'>{item.para}</p>
                <p className='text-xs text-gray-400 mt-2'>
                  {item.postedOn} • {item.posted} • Read More
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side News */}
        <div className='space-y-5'>
          {sideNews.map((item) => (
            <div key={item.id} className='flex space-x-4'>
              <div className='w-24 h-20 rounded-md overflow-hidden flex-shrink-0'>
                <Image
                  src={item.logo}
                  alt='News'
                  width={96}
                  height={80}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex flex-col justify-between'>
                <div className='text-xs text-red-500 font-semibold'>
                  {item.type}
                </div>
                <h3 className='text-sm font-bold leading-snug line-clamp-2'>
                  {item.title}
                </h3>
                <div className='text-xs text-gray-500'>
                  {item.timeToRead}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Root;