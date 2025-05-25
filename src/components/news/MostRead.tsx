"use client";

import React from "react";
import Image from "next/image";

interface MostReadNewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  author: string;
  timeAgo: string;
  category: string;
  readTime: string;
}

const mostReadData: MostReadNewsItem[] = [
  {
    id: 1,
    title: "Félicien Kabuga: Rwanda genocide suspect unfit to stand trial, UN court rules",
    summary:
      "About 85% of Rwandans are Hutus but the Tutsi minority had long dominated the country.",
    image: "/Logo1.jpg",
    author: "Jack Harleem",
    timeAgo: "10 hours ago",
    category: "Dossier",
    readTime: "1 min read",
  },
  {
    id: 2,
    title:
      "Stella explains what 'instrumental' Rob Marshall will bring to McLaren in 2024",
    summary: "",
    image: "/Logo1.jpg",
    author: "Oliver Grey",
    timeAgo: "5 hours ago",
    category: "Sport",
    readTime: "5 min read",
  },
  {
    id: 3,
    title: "Pope Francis undergoes abdominal surgery in latest health concern",
    summary: "",
    image: "/Logo1.jpg",
    author: "Ray Craig",
    timeAgo: "2 hours ago",
    category: "World",
    readTime: "2 min read",
  },
  {
    id: 4,
    title:
      "Fact check: Trump boasts about a massive oil purchase that never happened",
    summary: "",
    image: "/Logo1.jpg",
    author: "Raine Warner",
    timeAgo: "5 hours ago",
    category: "Politics",
    readTime: "5 min read",
  },
];

const MostRead = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Most Read</h2>
        <button className="text-red-500 text-sm font-medium hover:underline">
          See all
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Featured Article */}
        <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col md:flex-row">
          <Image
            src={mostReadData[0].image}
            alt={mostReadData[0].title}
            width={400}
            height={250}
            className="object-cover w-full md:w-1/2 h-60 md:h-auto"
          />
          <div className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <span className="font-medium text-black">{mostReadData[0].author}</span>
                <span>•</span>
                <span>{mostReadData[0].timeAgo}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {mostReadData[0].title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {mostReadData[0].summary}
              </p>
            </div>
            <div className="text-xs text-red-500 font-medium">
              {mostReadData[0].category} • {mostReadData[0].readTime}
            </div>
          </div>
        </div>

        {/* Side Articles */}
        <div className="space-y-4">
          {mostReadData.slice(1).map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-4 bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={80}
                height={80}
                className="rounded-lg object-cover w-20 h-20"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                  {item.title}
                </h4>
                <div className="mt-1 text-xs text-gray-500">
                  {item.author} • {item.timeAgo}
                </div>
                <div className="text-xs text-red-500 mt-1">
                  {item.category} • {item.readTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostRead;