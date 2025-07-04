'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import { IAccount } from '@/types';

// This component receives the full row data via `props.data` from AG Grid.
const ActionsCell = (props: { data: IAccount }) => {
  const { data: account } = props; // Destructure and rename for clarity

  const downloadSingleExcel = (accountToExport: IAccount) => {
    // --- THIS IS THE FIX ---
    // Instead of deleting a property, we use object destructuring to create a new
    // object that omits the 'avatar' property. This is type-safe and non-mutating.
    const { avatar, ...dataForSheet } = accountToExport;

    // The `json_to_sheet` function expects an array of objects.
    const worksheet = XLSX.utils.json_to_sheet([dataForSheet]);
    
    // Create a workbook and append the new worksheet.
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Account Details");
    
    // Trigger the file download in the browser.
    XLSX.writeFile(workbook, `account_${accountToExport.accountNo}.xlsx`);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <button
        onClick={(e) => {
          // IMPORTANT: Stop the row's click event from firing and navigating away.
          e.stopPropagation();
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