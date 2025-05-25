import React from 'react'
import { Metadata } from 'next';
import Navbar from '../../components/Navbar/Navbar';
import TopNews from '../../components/news/TopNews';
import MoreToExplore from '../../components/news/MoreToExplore';
import MostRead from '../../components/news/MostRead';
import SportsSection from '../../components/news/Sports';
import Footer from '../../components/Footer/Footer'

export const metadata: Metadata = {
    title: "Daily Trend News - Breaking news, video and the latest top stories from the U.S. and around the world",
    description: "Breaking news, video and the latest top stories from the U.S. and around the world",
  };

const page = () => {
  return(
    <div>
        <Navbar/>
        <TopNews/>
        <MoreToExplore/>
        <MostRead/>
        <SportsSection/>
        <Footer/>
    </div>
  )
};

export default page;