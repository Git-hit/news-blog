"use client";
import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";

interface ExploreItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  category: string;
  time: string;
  readTime: string;
}

const exploreData: ExploreItem[] = [
  {
    id: 1,
    title: "AI is changing journalism: What to expect in 2025",
    summary:
      "Artificial Intelligence is revolutionizing the media industry with tools that enhance reporting accuracy and content delivery.",
    image: "/Logo1.jpg",
    category: "Technology",
    time: "2 hours ago",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Inside the mind of a political campaign strategist",
    summary:
      "From digital strategies to grassroots mobilization, discover how campaigns are shaped behind the scenes.",
    image: "/Logo1.jpg",
    category: "Politics",
    time: "4 hours ago",
    readTime: "3 min read",
  },
  {
    id: 3,
    title: "Top 10 destinations for remote work travel in 2025",
    summary:
      "Looking for the best places to work remotely while exploring the world? Here's the ultimate list.",
    image: "/Logo1.jpg",
    category: "Travel",
    time: "6 hours ago",
    readTime: "5 min read",
  },
  {
    id: 4,
    title: "Nutrition myths debunked by health experts",
    summary:
      "Health experts weigh in on the most common nutrition myths that people still believe today.",
    image: "/Logo1.jpg",
    category: "Health",
    time: "1 day ago",
    readTime: "2 min read",
  },
];

const MoreToExplore = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">More to Explore</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {exploreData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="text-sm text-red-500 font-medium mb-2 block">
                {item.category}
              </span>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {item.summary}
              </p>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span>{item.readTime}</span>
                <span className="mx-2">•</span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MoreToExplore;