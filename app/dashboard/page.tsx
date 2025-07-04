import AccountTable from '@/components/AccountTable';
import CompanySummaryTable from '@/components/CompanySummaryTable';

type Props = {
  searchParams?: {
    company?: string;
  };
};

export default async function DashboardPage({ searchParams }: Props) {
  const selectedCompany = searchParams?.company;

  if (selectedCompany) {
    return <AccountTable />;
  } else {
    return <CompanySummaryTable />;
  }
}
