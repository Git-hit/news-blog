"use client";

import Navbar from "../../../components/Navbar/Navbar";
import TopNews from "../../../components/news/TopNews";
import MoreToExplore from "../../../components/news/MoreToExplore";
import MostRead from "../../../components/news/MostRead";
import SportsSection from "../../../components/news/Sports";
import Footer from "../../../components/Footer/Footer";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Layout() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

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
        setNews([]);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <Navbar posts={news} />
      {loading ? (
        <div className="flex h-screen justify-center items-center">
          <div className="animate-spin border-2 border-slate-900 border-b-transparent rounded-full size-10"></div>
        </div>
      ) : (
        <>
          <TopNews topNewsData={news} category={slug} />
          <MoreToExplore exploreData={news} category={slug} />
          <MostRead mostReadData={news} category={slug} />
          {/* <SportsSection /> */}
        </>
      )}
      <Footer />
    </div>
  );
}