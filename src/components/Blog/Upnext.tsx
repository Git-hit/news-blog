"use client";
import React from "react";
import Image from "next/image";

interface UpNext {
  id: number;
  title: string;
  image: string;
  toRead: string;
}

const UpNextData: UpNext[] = [
  {
    id: 1,
    title: "Trump warns America’s businesses: Eat my tariffs, or pay the price",
    image: "Logo1.jpg",
    toRead: "4 minute read",
  },
  {
    id: 2,
    title: "Trump says the clock is ticking for 150 countries to make a deal or face higher tariffs",
    image: "Logo1.jpg",
    toRead: "5 minute read",
  },
  {
    id: 3,
    title: "Billionaires are turning on Trump",
    image: "Logo1.jpg",
    toRead: "4 minute read",
  },
  {
    id: 4,
    title:
      "China tariffs are no longer 145%, but for small businesses in the crossfire, ‘it’s still awful’",
    image: "Logo1.jpg",
    toRead: "6 minute read",
  },
  {
    id: 5,
    title: "Regional tariffs could soon be the new ‘reciprocal’ tariff",
    image: "Logo1.jpg",
    toRead: "4 minute read",
  },
];

const Upnext = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Up next</h2>

      <ul className="space-y-6">
        {UpNextData.map((item, index) => (
          <li
            key={item.id}
            className={`flex justify-between gap-4 pb-4 ${
              index !== UpNextData.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex-1">
              <h3 className="text-base font-medium text-black hover:underline cursor-pointer">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{item.toRead}</p>
            </div>
            <div className="w-28 h-20 flex-shrink-0">
              <Image
                src={`/${item.image}`}
                alt={item.title}
                width={112}
                height={80}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Upnext;