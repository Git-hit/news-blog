import React from 'react'
import { Metadata } from 'next';
import Head from 'next/head';
import Homepage from './Homepage';

export const metadata: Metadata = {
  title: "Daily Trend News - Trending News From India and the world",
  description: "Trending News From India and the world",
};


const page = () => {
  return(
    <div>
      <Head> </Head>
      <Homepage/>
    </div>
  )
};

export default page;