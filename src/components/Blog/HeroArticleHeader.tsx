"use client";

import React from "react";
import { Clock, Mail, LinkIcon } from "lucide-react";
import { FaFacebookSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

const articleData = {
  title: "These companies will raise prices because of Trump’s tariffs",
  author: "Daily Trend News",
  readTime: "5 minute read",
  publishDate: "Published 9:00 AM EDT, Sat May 24, 2025",
  imageUrl: "/Logo1.jpg",
  intro: [
    "In response to the recent tariffs imposed by the Trump administration, several major companies have announced price increases on their products. These tariffs, targeting imports from various countries, have led to increased costs for raw materials and components, prompting businesses to adjust their pricing strategies.",
    "Economists warn that these price hikes could contribute to inflationary pressures, affecting consumer spending and overall economic growth. The long-term impact of these tariffs remains uncertain, but businesses and consumers alike are bracing for potential financial strain.",
    "Industry leaders are calling for negotiations to mitigate the adverse effects of the tariffs, emphasizing the importance of stable trade relations for economic stability.",
    "More updates to follow as companies adjust their supply chain and government responses begin to take shape."
  ],
  sections: [
    {
      heading: "Walmart",
      paragraphs: [
        "Walmart said on April 15 it would increase prices because Trump’s tariffs were “too high,” particularly when it came to products made in China.",
        "We will do our best to keep our prices as low as possible. But given the magnitude of the tariffs, even at the reduced levels announced this week, we aren’t able to absorb all the pressure given the reality of narrow retail margins,” Walmart CEO Douglas McMillon said in an earnings call.",
        "Price changes at Walmart will likely take effect by the end of May and prices will increase “much more” in June, the company’s chief financial officer John David Rainey, told CNBC."
      ]
    },
    {
      heading: "Mattel",
      paragraphs: [
        "On May 6, toy manufacturing giant Mattel said that it would raise prices due to tariffs. Chief Executive Ynon Kreiz told investors that “under the current scenarios we are considering” in response to tariffs, he expects 40% to 50% of its products to remain priced at $20 or less. However, he also advocated for zero tariffs on toys and games around the world.",
        "Trump threatened Mattel, saying he would “put a 100% tariff on his toys, and he won’t sell one toy in the United States, and that’s their biggest market.”"
      ]
    },
    {
      heading: "Best Buy",
      paragraphs: [
        "Electronics retailer Best Buy warned during a March earnings call that “vendors across our entire assortment will pass along some level of tariff costs to retailers, making price increases for American consumers highly likely.”",
        "Some electronic components and devices are temporarily exempt from Trump’s tariffs. That won’t last forever.",
        "Nintendo, for instance, delayed the pre-order date for its Switch 2 video game console because of concerns regarding tariffs. The company later said pricing for the console won’t change from the initial $450, but the accessories “will experience price adjustments from those announced on April 2 due to changes in market conditions.” The same could happen to any product because of “market conditions,” the company noted.",
        "Meanwhile, Lin Tao, CFO of PlayStation maker Sony, said “we may pass on the price” during an earnings call."
      ]
    },
    {
      heading: "Shein and Temu",
      paragraphs: [
        "Chinese retailers Shein and Temu were once largely exempt from tariffs because of the “de minimis” exemption, which spared shipments of goods worth less than $800. But Trump signed an executive order getting rid of the exemption.",
        "Due to recent changes in global trade rules and tariffs, our operating expenses have gone up. To keep offering the products you love without compromising on quality, we will be making price adjustment starting April 25, 2025,” Temu wrote in a notice similar to an announcement Shein made.",
        "Both companies have since raised prices on some products. For instance, two patio chairs listed on Temu and reviewed by CNN had a $61.72 price tag on April 24. The next day, when the pricing changes took effect, they were listed at $70.17. On Shein, CNN noted a bathing suit set cost $4.39. The next day, it cost $8.39, a 91% increase."
      ]
    },
    {
      heading: "Ford and Subaru",
      paragraphs: [
        "Imported cars were hit with a 25% tariff and most auto parts face a similar duty, although some automakers can request partial refunds — for now.",
        "Ford’s CFO Sherry House said it expects to raise its US car prices as much as 1.5% in the second half of 2025 due to tariffs.",
        "The carmaker extended its “employee pricing” offer through July as consumers rushed to buy cars ahead of Trump’s tariffs.",
        "Japanese automaker Subaru has also said it will increase US prices to “offset increased costs,” citing “current market conditions.” Subaru did not specify how much prices could increase.",
        "The changes were made to offset increased costs while maintaining a solid value proposition for the customer,” a Subaru of America spokesperson said in a statement. “Subaru pricing is not based on the country of origin of its products.”"
      ]
    },
    {
      heading: "Procter & Gamble, Stanley Black & Decker",
      paragraphs: [
        "Household product maker Procter & Gamble, which owns brands like Pampers, Tide and Charmin, said during an earnings call on April 24 it would consider raising prices in some categories and markets.",
        "That same day, CEO Jon Moeller told CNBC that “there will likely” be price increases for consumers because “tariffs are inherently inflationary.”",
        "In April, Stanley Black & Decker, which owns power tool brands, raised prices by an average of high single-digits because of tariffs. Another round of price increases will come later this year."
      ]
    },
    {
      heading: "Adidas",
      paragraphs: [
        "Adidas said higher costs are likely for products in the US due to Trump’s back-and-forth tariff.",
        "Given the uncertainty around the negotiations between the US and the different exporting countries, we do not know what the final tariffs will be,” Adidas CEO Bjørn Gulden said in an earnings release on April 29.",
        "He added that “cost increases due to higher tariffs will eventually cause price increases.”"
      ]
    }
  ]
};

const BlogPage = () => {
  return (
    <main className='min-h-screen bg-white text-black'>
      <section className='max-w-5xl mx-auto px-4 py-10'>
        <h1 className='text-4xl sm:text-5xl font-extrabold leading-tight'>{articleData.title}</h1>
        <p className='mt-4 text-sm text-gray-700'>By <span className='text-blue-800 font-medium'>{articleData.author}</span></p>
        <div className='flex flex-wrap items-center text-sm text-gray-600 mt-2 gap-2'>
          <Clock size={16} />
          <span>{articleData.readTime}</span>
          <span className='mx-1'>·</span>
          <span>{articleData.publishDate}</span>
        </div>
        <div className='flex items-center gap-4 mt-6'>
          <FaFacebookSquare className='w-5 h-5 text-black hover:text-blue-600 cursor-pointer' />
          <FaXTwitter className='w-5 h-5 text-black hover:text-black cursor-pointer' />
          <Mail className='w-5 h-5 text-black hover:text-gray-700 cursor-pointer' />
          <LinkIcon className='w-5 h-5 text-black hover:text-gray-700 cursor-pointer' />
        </div>
      </section>

      <div className='max-w-5xl mx-auto px-4'>
        <Image
          src={articleData.imageUrl}
          alt='Tariffs Impact'
          width={1000}
          height={500}
          className='w-full object-cover rounded-lg mb-8'
        />
      </div>

      <article className='max-w-5xl mx-auto px-4 space-y-6 text-lg text-gray-800 leading-relaxed pb-20'>
        {articleData.intro.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>

      {articleData.sections.map((section, index) => (
        <article
          key={index}
          className='max-w-5xl mx-auto px-4 space-y-6 text-lg text-gray-800 leading-relaxed pb-20'
        >
          <h2 className='text-3xl font-bold'>{section.heading}</h2>
          {section.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>
      ))}
    </main>
  );
};

export default BlogPage;