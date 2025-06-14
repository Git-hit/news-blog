"use client";

import Navbar from "../components/Navbar/Navbar";
import Root from "../components/root/Root";
import LatestNews from "../components/root/LatestNews/LatestNews";
import MustRead from "../components/root/MustRead/MustRead";
import NewsFooter from "../components/Footer/Footer";

const Homepage = ({ news, menu }) => {
  return (
    <div>
      <Navbar posts={news} menu={menu} />
      <Root mainNews={news} />
      <LatestNews news={news} />
      <MustRead posts={news} />
      <NewsFooter />
    </div>
  );
};

export default Homepage;