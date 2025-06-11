import Homepage from './Homepage';

export async function generateMetadata() {
  const res = await fetch(`/api/settings`, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });
  const settings = await res.json();
  const get = (key) => settings[key];

  return {
    title: get('site_title') || 'Default Title',
    description: get('meta_description') || 'Default Description',
    keywords: get('meta_keywords') || '',
    // other: {
    //   'google-site-verification': get('google_verification_code') || '',
    // }
  };
}

export default function Page() {
  return <Homepage />;
}