"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Root from "../components/root/Root";
import LatestNews from "../components/root/LatestNews/LatestNews";
import MustRead from "../components/root/MustRead/MustRead";
import NewsFooter from "../components/Footer/Footer";

const Homepage = () => {
  const [news, setNews] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [newsRes, menuRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`),
        ]);

        const [newsData, menuData] = await Promise.all([
          newsRes.json(),
          menuRes.json(),
        ]);

        setNews(newsData);
        setMenu(menuData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setNews([]);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex h-screen justify-center items-center">
          <div className="animate-spin border-2 border-slate-900 border-b-transparent rounded-full size-10"></div>
        </div>
      ) : (
        <div>
          <Navbar posts={news} menu={menu} />
          <Root mainNews={news} />
          <LatestNews news={news} />
          <MustRead posts={news} />
          <NewsFooter />
        </div>
      )}
    </>
  );
};

export default Homepage;