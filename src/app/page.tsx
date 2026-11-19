import { getPortfolioData } from '@/lib/data';
import PortfolioClient from '@/components/PortfolioClient';

export const revalidate = 0; // Always fresh or on-demand

export default function HomePage() {
  const data = getPortfolioData();

  return <PortfolioClient initialData={data} />;
}
