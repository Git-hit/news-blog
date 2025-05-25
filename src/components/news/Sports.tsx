"use client";

import React from "react";
import Image from "next/image";

interface SportsArticle {
  id: number;
  title: string;
  image: string;
  category: string;
  time: string;
  description: string;
  author: string;
}

const sportsData: SportsArticle[] = [
  {
    id: 1,
    title: "Champions League Final: Preview & Predictions",
    image: "/Logo1.jpg",
    category: "Football",
    time: "2 min read",
    description:
      "Get ready for the showdown as Europe's biggest clubs face off in the Champions League Final.",
    author: "Tom Hardy",
  },
  {
    id: 2,
    title: "NBA Playoffs: Heat vs Celtics Game 6 Recap",
    image: "/Logo1.jpg",
    category: "Basketball",
    time: "4 min read",
    description:
      "The Heat hold off a late surge from the Celtics to force a Game 7 in dramatic fashion.",
    author: "Emma Green",
  },
  {
    id: 3,
    title: "Olympics 2024: New Events Announced",
    image: "/Logo1.jpg",
    category: "Olympics",
    time: "3 min read",
    description:
      "The IOC confirms the addition of parkour and eSports to the upcoming 2024 Summer Olympics.",
    author: "Daniel Cho",
  },
  {
    id: 4,
    title: "Olympics 2024: New Events Announced",
    image: "/Logo1.jpg",
    category: "Olympics",
    time: "3 min read",
    description:
      "The IOC confirms the addition of parkour and eSports to the upcoming 2024 Summer Olympics.",
    author: "Daniel Cho",
  },
  {
    id: 5,
    title: "Olympics 2024: New Events Announced",
    image: "/Logo1.jpg",
    category: "Olympics",
    time: "3 min read",
    description:
      "The IOC confirms the addition of parkour and eSports to the upcoming 2024 Summer Olympics.",
    author: "Daniel Cho",
  },
  {
    id: 6,
    title: "Olympics 2024: New Events Announced",
    image: "/Logo1.jpg",
    category: "Olympics",
    time: "3 min read",
    description:
      "The IOC confirms the addition of parkour and eSports to the upcoming 2024 Summer Olympics.",
    author: "Daniel Cho",
  },
];

const SportsSection = () => {
  const [featured, ...others] = sportsData;

  return (
    <section className='max-w-7xl mx-auto px-4 py-10'>
      <h2 className='text-3xl font-bold text-gray-900 mb-8'>Sports</h2>

      {/* Featured Article */}
      <div className='flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden mb-8'>
        <Image
          src={featured.image}
          alt={featured.title}
          width={500}
          height={300}
          className='w-full md:w-1/2 object-cover h-64 md:h-auto'
        />
        <div className='p-6 flex flex-col justify-between'>
          <div>
            <span className='text-xs uppercase text-blue-600 font-bold'>
              {featured.category}
            </span>
            <h3 className='text-2xl font-semibold text-gray-800 mt-2'>
              {featured.title}
            </h3>
            <p className='text-sm text-gray-600 mt-3'>{featured.description}</p>
          </div>
          <div className='text-xs text-gray-400 mt-4'>
            By {featured.author} • {featured.time}
          </div>
        </div>
      </div>

      {/* Other Articles (Horizontal Scroll) */}
      <div className='relative'>
        <div className='overflow-x-auto pb-2'>
          <div className='flex space-x-4 min-w-full'>
            {others.map((article) => (
              <div
                key={article.id}
                className='min-w-[280px] max-w-xs bg-white shadow rounded-lg overflow-hidden flex-shrink-0 hover:shadow-lg transition'>
                <Image
                  src={article.image}
                  alt={article.title}
                  width={280}
                  height={160}
                  className='w-full h-40 object-cover'
                />
                <div className='p-4'>
                  <span className='text-xs uppercase text-green-600 font-bold'>
                    {article.category}
                  </span>
                  <h4 className='text-md font-semibold mt-1 text-gray-800'>
                    {article.title}
                  </h4>
                  <p className='text-xs text-gray-500 mt-2'>
                    {article.description}
                  </p>
                  <div className='text-[11px] text-gray-400 mt-2'>
                    By {article.author} • {article.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SportsSection;
