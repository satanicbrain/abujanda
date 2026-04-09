import { pingDatabase } from '@/lib/db';
import DashboardClient from './_components/dashboard-client';

export default async function DashboardPage() {
  const dbStatus = await pingDatabase();

  return <DashboardClient dbStatusMessage={dbStatus.message} />;
}
