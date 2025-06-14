import Homepage from './Homepage';
import { getNews } from '@/src/lib/getNews';
import { getMenu } from '@/src/lib/getMenu';

export default async function Page() {
  const [news, menu] = await Promise.all([getNews(), getMenu()]);
  return <Homepage news={news} menu={menu} />;
}