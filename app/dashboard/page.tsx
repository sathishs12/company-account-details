import AccountTable from '@/components/AccountTable';
import CompanySummaryTable from '@/components/CompanySummaryTable';

interface DashboardPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const selectedCompany = searchParams?.company as string | undefined;

  if (selectedCompany) {
    return <AccountTable />;
    // You could pass companyName={selectedCompany} if needed
  } else {
    return <CompanySummaryTable />;
  }
}
