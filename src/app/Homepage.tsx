"use client"
import React from 'react'
import Navbar from '../components/Navbar/Navbar';
import Root from '../components/root/Root';
import LatestNews from '../components/root/LatestNews/LatestNews';
import MustRead from '../components/root/MustRead/MustRead';
import WeeklyHighlight from '../components/root/WeeklyHighlight/WeeklyHighlight';
import Footer from '../components/Footer/Footer'

const Homepage = () => {
  return(
    <div>
        <Navbar/>
        <Root/>
        <LatestNews/>
        <MustRead/>
        <WeeklyHighlight/>
        <Footer/>
    </div>
  )
};

export default Homepage;