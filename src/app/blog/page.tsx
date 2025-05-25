import React from 'react'
import { Metadata } from 'next';
import Navbar from '../../components/Navbar/Navbar';
import NewsFooter from '../../components/Footer/Footer';
import TopIndex from '../../components/Blog/TopIndex';
import HeroArticleHeader from '../../components/Blog/HeroArticleHeader';
import Upnext from '../../components/Blog/Upnext';
import MostRead from '../../components/news/MostRead';
import TariffNews from '../../components/Blog/TariffNews';


export const metadata: Metadata = {
    title: "These companies will raise prices because of Trump’s tariffs",
    description: "These companies will raise prices because of Trump’s tariffs",
  };

const page = () => {
  return(
    <div>
        <Navbar/>
        <TopIndex/>
        <HeroArticleHeader/>
        <Upnext/>
        <MostRead/>
        <TariffNews/>
        <NewsFooter/>
    </div>
  )
};

export default page;