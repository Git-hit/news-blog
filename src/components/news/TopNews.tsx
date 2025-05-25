"use client";
import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";

interface TopNewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  time: string;
  readTime: string;
}

const topNewsData: TopNewsItem[] = [
  {
    id: 1,
    title: "Félicien Kabuga: Rwanda genocide suspect unfit to stand trial, UN court rules",
    description:
      "About 85% of Rwandans are Hutu but the Tutsi minority has long dominated the country. In 1994, the Hutus overthrew the Tutsi monarchy and tens of thousands of Tutsis fled to neighbouring countries, like Uganda.",
    image: "/Logo1.jpg",
    category: "Dossier",
    author: "Jack Harleom",
    time: "10 hours ago",
    readTime: "1 min read",
  },
  {
    id: 2,
    title: "Stella explains what 'instrumental' Rob Marshall will bring to McLaren in 2024",
    description: "",
    image: "/Logo1.jpg",
    category: "Sport",
    author: "Oliver Grey",
    time: "5 hours ago",
    readTime: "5 min read",
  },
  {
    id: 3,
    title: "Pope Francis undergoes abdominal surgery in latest health concern",
    description: "",
    image: "/Logo1.jpg",
    category: "World",
    author: "Ray Craig",
    time: "2 hours ago",
    readTime: "2 min read",
  },
  {
    id: 4,
    title: "Fact check: Trump boasts about a massive oil purchase that never happened",
    description: "",
    image: "/Logo1.jpg",
    category: "Politics",
    author: "Raine Warner",
    time: "5 hours ago",
    readTime: "5 min read",
  },
  {
    id: 5,
    title: "Fact check: Trump boasts about a massive oil purchase that never happened",
    description: "",
    image: "/Logo1.jpg",
    category: "Politics",
    author: "Raine Warner",
    time: "5 hours ago",
    readTime: "5 min read",
  },
];

const TopNews = () => {
  const [mainStory, ...sideStories] = topNewsData;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Top News</h2>
        <a href="#" className="text-sm text-red-600 font-medium hover:underline">
          See all →
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Featured Article */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <Image
            src={mainStory.image}
            alt={mainStory.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span className="font-medium">{mainStory.author}</span>
              <span>•</span>
              <span>{mainStory.time}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{mainStory.title}</h3>
            <p className="text-sm text-gray-700 line-clamp-3">{mainStory.description}</p>
            <div className="flex items-center text-xs text-red-600 mt-3">
              <span>{mainStory.category}</span>
              <span className="mx-2 text-gray-400">•</span>
              <Clock className="w-3 h-3 mr-1 text-gray-400" />
              <span className="text-gray-500">{mainStory.readTime}</span>
            </div>
          </div>
        </div>

        {/* Other Top News Articles */}
        <div className="flex flex-col space-y-5">
          {sideStories.map((item) => (
            <div key={item.id} className="flex items-start space-x-4">
              <Image
                src={item.image}
                alt={item.title}
                width={100}
                height={100}
                className="w-24 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                  <span className="font-medium">{item.author}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center text-xs text-red-600">
                  <span>{item.category}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                  <span className="text-gray-500">{item.readTime}</span>
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