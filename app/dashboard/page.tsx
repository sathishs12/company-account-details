// import AccountTable from '@/components/AccountTable';
import CompanySummaryTable from '@/components/CompanySummaryTable';
import { IAccount } from '@/types';


async function getAccountsFromApi(): Promise<IAccount[]> {
  const apiEndpoint = "https://684fa5d6e7c42cfd17955990.mockapi.io/api/account-details/accountDetails";
  try {
    const res = await fetch(apiEndpoint, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch from MockAPI: ${res.status} ${res.statusText}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("An error occurred while fetching accounts:", error);
    return [];
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { company?: string };
}) {
  const selectedCompany = searchParams?.company;

  if (selectedCompany) {
    // const companyAccounts = allAccounts.filter(
    //   (account) => getCompanyName(account.id) === selectedCompany
    // );
    // --- UPDATED: Pass the companyName prop ---
    // return <AccountTable   />;
    // <AccountTable accounts={companyAccounts} companyName={selectedCompany} />;
  } else {
    // return <CompanySummaryTable accounts={allAccounts} />;
    return <CompanySummaryTable />;

  }
}