import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   icons: {
//     icon: "/Logo.ico",
//   },
// };

export async function generateMetadata() {
  const res = await fetch(`/api/settings`, {
    next: { revalidate: 3600 }, // cache hourly
  });
  const settings = await res.json();
  const get = (key) => settings[key];

  return {
    icons: {
      icon: "/Logo.ico",
    },
    title: get('site_title') || 'Default Site Title',
    description: get('meta_description') || '',
    keywords: get('meta_keywords') || '',
    other: {
      'google-site-verification': get('google_verification_code') || '',
    },
  };
}

export default async function RootLayout({ children }) {
  const res = await fetch(`/api/settings`, {
    next: { revalidate: 3600 },
  });
  const settings = await res.json();
  // console.log(settings)
  const get = (key) => settings[key];

  const gaID = get('google_analytics_id');
  const adsenseID = get('google_adsense_id');
  const verificationCode = get('google_verification_code');

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Logo.ico" />
        {gaID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaID}');
                `,
              }}
            />
          </>
        )}
        {adsenseID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseID}`}
          />
        )}
        {verificationCode && (
          <meta name="google-site-verification" content={verificationCode} />
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}