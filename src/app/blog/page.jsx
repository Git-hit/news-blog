import React from 'react'
import { Metadata } from 'next';
import Navbar from '../../components/Navbar/Navbar';
import NewsFooter from '../../components/Footer/Footer';
import TopIndex from '../../components/Blog/TopIndex';
import Upnext from '../../components/Blog/Upnext';
import MostRead from '../../components/news/MostRead';
import TariffNews from '../../components/Blog/TariffNews';
import BlogPage from '../../components/Blog/HeroArticleHeader';


export const metadata = {
    title: "These companies will raise prices because of Trump’s tariffs",
    description: "These companies will raise prices because of Trump’s tariffs",
  };

const page = () => {
  return(
    <div>
        <Navbar/>
        <TopIndex/>
        <BlogPage/>
        <Upnext/>
        <MostRead/>
        <TariffNews/>
        <NewsFooter/>
    </div>
  )
};

export default page;