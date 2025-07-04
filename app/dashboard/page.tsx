import AccountTable from '@/components/AccountTable';
import CompanySummaryTable from '@/components/CompanySummaryTable';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const selectedCompany = resolvedSearchParams?.company as string | undefined;

  return selectedCompany ? <AccountTable /> : <CompanySummaryTable />;
}