'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import { IAccount } from '@/types';

interface ActionsCellProps {
  data: IAccount;
}

const ActionsCell = (props: ActionsCellProps) => {
  const { data: account } = props;

  const downloadSingleExcel = (accountToExport: IAccount) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { avatar, ...dataForSheet } = accountToExport;

    const worksheet = XLSX.utils.json_to_sheet([dataForSheet]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Account Details');
    XLSX.writeFile(workbook, `account_${accountToExport.accountNo}.xlsx`);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click propagation
          downloadSingleExcel(account);
        }}
        className="p-1 rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
        title="Download as Excel"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ActionsCell;
