"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Root from "../components/root/Root";
import LatestNews from "../components/root/LatestNews/LatestNews";
import MustRead from "../components/root/MustRead/MustRead";
import WeeklyHighlight from "../components/root/WeeklyHighlight/WeeklyHighlight";
import NewsFooter from "../components/Footer/Footer";

const Homepage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
        setNews([]); // on error, empty array to stop spinner
        setLoading(false);
      });
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex h-screen justify-center items-center">
          <div className="animate-spin border-2 border-slate-900 border-b-transparent rounded-full size-10"></div>
        </div>
      ) : (
        <div>
          <Navbar posts={news} />
          <Root mainNews={news} />
          <LatestNews news={news} />
          <MustRead posts={news} />
          {/* <WeeklyHighlight/> */}
          <NewsFooter />
        </div>
      )}
    </>
  );
};

export default Homepage;