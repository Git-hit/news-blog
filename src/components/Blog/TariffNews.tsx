"use client";
import React from "react";

interface NewsItem {
  id: number;
  headline: string;
  content: string;
  source: string;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    headline: "Widespread Corporate Price Increases",
    content:
      "A survey by Allianz shows 54% of U.S. companies plan to raise prices due to new tariffs. Only 22% say they can absorb the costs. 42% of exporting firms expect turnover to drop 2–10% in the next year.",
    source: "theguardian.com"
  },
  {
    id: 2,
    headline: "Impact on Consumer Goods",
    content:
      "Toy companies like Mattel and Hasbro—sourcing 80% from China—warn of 56% price hikes. Apparel may jump 37.5–69.1%, footwear by 29%, potentially costing households $362–$624 more per year.",
    source: "kiplinger.com"
  },
  {
    id: 3,
    headline: "Automotive Industry Challenges",
    content:
      "A 25% tariff on imported vehicles could raise car prices by $4,711. Stellantis has paused production, triggering layoffs. U.S. carmakers fear it's now cheaper to import than build locally.",
    source: "en.wikipedia.org"
  },
  {
    id: 4,
    headline: "Technology Sector Pressures",
    content:
      "Apple could see iPhone prices rise by $250 if it doesn’t move manufacturing from China. With 90% of production there, Apple says relocation isn't feasible due to cost and staffing issues.",
    source: "the-sun.com"
  },
  {
    id: 5,
    headline: "International Trade Tensions",
    content:
      "The U.S. imposed 25% tariffs on Canada and Mexico, prompting retaliation. Canada and Mexico plan matching tariffs, which could affect food and car part prices significantly.",
    source: "en.wikipedia.org"
  },
  {
    id: 6,
    headline: "Economic Outlook",
    content:
      "Consumer inflation expectations have reached levels not seen since 1981. Yale estimates a $4,000 drop in purchasing power per U.S. household. Experts fear long-term economic slowdown.",
    source: "theguardian.com"
  }
];

const TariffNews = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-red-600">Daily Trend News</h2>
      {newsData.map(({ id, headline, content, source }) => (
        <div key={id} className="mb-6 bg-gray-100/90 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{headline}</h3>
          <p className="text-gray-700">{content}</p>
          <a
            href={`https://${source}`}
            className="text-blue-600 hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source: {source}
          </a>
        </div>
      ))}
    </div>
  );
};

export default TariffNews;
