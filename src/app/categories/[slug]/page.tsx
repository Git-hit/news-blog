import { Metadata } from 'next';
import Layout from './layout';

export const metadata: Metadata = {
  title: "Daily Trend News - Trending News From India and the world",
  description: "Trending News From India and the world",
};

const Page = () => {
  return (
    <Layout />
  );
};

export default Page;