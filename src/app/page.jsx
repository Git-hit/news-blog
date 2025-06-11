import Homepage from './Homepage';

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });
  const settings = await res.json();
  const get = (key) => settings[key];

  return {
    title: get('site_title') || 'Default Title',
    description: get('meta_description') || 'Default Description',
    keywords: get('meta_keywords') || '',
  };
}

export default function Page() {
  return <Homepage />;
}