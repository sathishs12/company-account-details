import AccountTable from '@/components/AccountTable';
import CompanySummaryTable from '@/components/CompanySummaryTable';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const selectedCompany = searchParams?.company as string | undefined;

  return selectedCompany ? <AccountTable /> : <CompanySummaryTable />;
}
