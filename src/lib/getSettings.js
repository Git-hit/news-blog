export async function getSettings() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        next: { revalidate: 3600 },
        cache: 'force-cache',
    });
    return res.json();
}