export async function getMenu() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
      next: { revalidate: 300 },
    });
    return res.json();
}