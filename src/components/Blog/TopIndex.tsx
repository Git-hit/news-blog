"use client";

import React from "react";
import { ArrowDown } from "lucide-react";

const marketIndexes = [
  { name: "DOW", value: "41,603.07", change: "0.61%" },
  { name: "S&P 500", value: "5,802.82", change: "0.67%" },
  { name: "NASDAQ", value: "18,737.21", change: "1.00%" },
];

const marketNews = [
  "Pentagon Press Association calls Defense Secretary Hegseth’s access restrictions...",
  "X temporarily down for thousands of users",
  "These companies will raise prices because of Trump’s tariffs",
];

const TopIndexS = () => {
  return (
    <div className="w-full border-b border-gray-200 bg-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left: Markets */}
        <div className="flex-1">
          <h4 className="font-semibold mb-2">Markets →</h4>
          <ul>
            {marketIndexes.map((index) => (
              <li key={index.name} className="flex justify-between items-center py-1">
                <span className="font-medium">{index.name}</span>
                <div className="flex items-center gap-4">
                  <span>{index.value}</span>
                  <span className="text-red-600 flex items-center gap-1">
                    {index.change}
                    <ArrowDown size={14} />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle: Fear & Greed Index */}
        <div className="flex-1 border-l border-gray-200 px-6 flex flex-col items-start md:items-center">
          <h4 className="font-semibold mb-2">Fear & Greed Index →</h4>
          <div className="flex items-center gap-4">
            {/* Simulated Gauge */}
            <div className="relative w-24 h-24 rounded-full border-8 border-green-300 flex items-center justify-center text-xl font-bold text-green-600">
              64
            </div>
            <div>
              <div className="text-green-700 font-semibold">Greed</div>
              <div className="text-xs text-gray-600">is driving the US market</div>
            </div>
          </div>
        </div>

        {/* Right: Latest Market News */}
        <div className="flex-1 border-l border-gray-200 pl-6">
          <h4 className="font-semibold mb-2">Latest Market News →</h4>
          <ul className="space-y-2">
            {marketNews.map((news, index) => (
              <li
                key={index}
                className="text-gray-800 hover:underline cursor-pointer truncate"
              >
                {news}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopIndexS;