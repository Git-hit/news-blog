export async function getNews() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
      next: { revalidate: 300 }, // cache for 5 min
    });
    return res.json();
}