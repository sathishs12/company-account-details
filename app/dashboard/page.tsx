import AccountTable from '@/components/AccountTable';
import CompanySummaryTable from '@/components/CompanySummaryTable';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { company?: string };
}) {
  // const allAccounts = await getAccountsFromApi();
  const selectedCompany = searchParams?.company;

  if (selectedCompany) {
    // const companyAccounts = allAccounts.filter(
    //   (account) => getCompanyName(account.id) === selectedCompany
    // );
    // --- UPDATED: Pass the companyName prop ---
    return <AccountTable   />;
    // <AccountTable accounts={companyAccounts} companyName={selectedCompany} />;
  } else {
    // return <CompanySummaryTable accounts={allAccounts} />;
    return <CompanySummaryTable />;

  }
}
