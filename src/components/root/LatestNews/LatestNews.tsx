"use client";
import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DateTime } from "luxon";

const LatestNews = () => {
  interface NewsItem {
    id: number;
    image: string;
    logo: string;
    name: string;
    posted: string;
    title: string;
    para: string;
    type: string;
    timeToRead: string;
  }

  const news: NewsItem[] = [
    {
      id: 1,
      image: "/logo1.jpg",
      logo: "/logo1.png",
      name: "Formula 1",
      posted: "10 hours ago",
      title: "F1 teams had big upgrades planned for Imola – but what happens now?",
      para: "",
      type: "Sport",
      timeToRead: "1 min read",
    },
    {
      id: 2,
      image: "/logo1.jpg",
      logo: "/logo2.png",
      name: "BBC News",
      posted: "5 hours ago",
      title: "Ukraine war: Wagner boss rubbishes Russian claims of Ukrainian casualties",
      para: "",
      type: "War",
      timeToRead: "1 min read",
    },
    {
      id: 3,
      image: "/logo1.jpg",
      logo: "/logo3.png",
      name: "CNN News",
      posted: "2 hours ago",
      title: "Brutal killings of two young girls show one of India’s biggest problems is getting worse",
      para: "",
      type: "World",
      timeToRead: "1 min read",
    },
    {
      id: 4,
      image: "/logo1.jpg",
      logo: "/logo4.png",
      name: "Al Jazeera",
      posted: "15 hours ago",
      title: "Middle East crisis deepens amid rising tensions",
      para: "",
      type: "Politics",
      timeToRead: "1 min read",
    },
  ];

  // Convert '5 hours ago' to DateTime
  const parsePostedToDate = (posted: string): DateTime => {
    const [value, unitRaw] = posted.split(" ");
    const unit = unitRaw.replace(/s$/, ""); // singularize units
    const amount = parseInt(value, 10);
    return DateTime.now().minus({ [unit]: amount });
  };

  // Get top 3 most recent posts
  const getTopLatestPosts = (data: NewsItem[], count: number): NewsItem[] => {
    return [...data]
      .sort(
        (a, b) =>
          parsePostedToDate(b.posted).toMillis() -
          parsePostedToDate(a.posted).toMillis()
      )
      .slice(0, count);
  };

  const latestPosts = getTopLatestPosts(news, 3);

  return (
    <div className="px-5 lg:px-20 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Latest News</h2>
        <div className="text-red-500 flex items-center cursor-pointer hover:underline">
          <span>See all</span>
          <ArrowRight className="ml-1 w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestPosts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={300}
              className="w-full h-52 object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div className="flex items-center text-sm text-gray-600 space-x-2 mb-2">
                {/* <Image src={item.logo} alt="logo" width={18} height={18} className="rounded-full" />
                <span className="font-semibold">{item.name}</span>
                <span>•</span>
                <span>{item.posted}</span> */}
              </div>
              <h3 className="text-lg font-semibold mb-4">{item.title}</h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span className="text-red-600 font-medium">
                  {item.type} •{" "}
                  <span className="text-gray-500">{item.posted}</span>
                </span>
                <span>{item.timeToRead}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;