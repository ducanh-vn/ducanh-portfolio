import { getPortfolioData } from '@/lib/data';
import PortfolioClient from '@/components/portfolio/PortfolioClient';

export const revalidate = 0; // Always fresh or on-demand

export default async function HomePage() {
  const data = await getPortfolioData();

  return <PortfolioClient initialData={data} />;
}
