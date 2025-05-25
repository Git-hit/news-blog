"use client";
import React from "react";

interface MostReadItem {
  id: number;
  title: string;
}

const mostReadData: MostReadItem[] = [
  { id: 1, title: "Colleges are canceling affinity graduations due to anti-DEI policies. Here is how students are preserving the traditions" },
  { id: 2, title: "These companies will raise prices because of Trump’s tariffs" },
  { id: 3, title: "How Trump’s megabill transfers wealth in the US" },
  { id: 4, title: "Twin 19-year-olds were found dead on a remote Georgia mountaintop. Police now say they’ve solved the mystery" },
  { id: 5, title: "Pentagon Press Association calls Defense Secretary Hegseth’s access restrictions ‘a direct attack’" },
  { id: 6, title: "Georgia man who fled with the nanny after his wife’s killing is charged with murder 19 years later" },
  { id: 7, title: "A fungi that can ‘eat you from the inside out’ could spread as the world heats up" },
  { id: 8, title: "Anglo-Saxons buried a mysterious vessel over a millennium ago. Archaeologists discovered its contents" },
  { id: 9, title: "The spectacular rise and swift erasure of Black Lives Matter Plaza" },
  { id: 10, title: "Texas woman sues state lottery after not receiving controversial $83.5M jackpot" },
];

const MostRead = () => {
  const firstColumn = mostReadData.slice(0, 5);
  const secondColumn = mostReadData.slice(5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Most read</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[firstColumn, secondColumn].map((column, colIndex) => (
          <ul key={colIndex} className="space-y-6">
            {column.map((item) => (
              <li key={item.id} className="border-b pb-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold text-lg">{item.id}</span>
                  <p className="text-black hover:underline cursor-pointer leading-snug">{item.title}</p>
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default MostRead;