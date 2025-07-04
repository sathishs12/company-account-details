'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import CompanyAnalyticsPopup from './CompanyAnalyticsPopup';

interface ApiAccountData {
  id: string;
  companyName: string;
  name: string;
  accountNo: string;
  currentBalance: number;
  status: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

interface RowData {
  name: string;
  number: number;
}

const CompanySummaryTable = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [rowData, setRowData] = useState<RowData[]>([]);

const fetchData = async () => {
  try {
    const response = await fetch(
      'https://684fa5d6e7c42cfd17955990.mockapi.io/api/account-details/accountDetails'
    );
    const data: ApiAccountData[] = await response.json();

    const companyCounts: Record<string, number> = {};
    data.forEach((account) => {
      companyCounts[account.companyName] = (companyCounts[account.companyName] || 0) + 1;
    });

    const groupedData: RowData[] = Object.entries(companyCounts).map(([name, number]) => ({
      name,
      number,
    }));

    setRowData(groupedData);
  } catch (error) {
    console.error('Failed to fetch account data:', error);
  }
};


  const filteredData = useMemo(() => {
    return rowData.filter((row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rowData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="flex flex-col shadow-md sm:rounded-lg bg-white h-[480px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b gap-4">
        <h1 className="text-xl md:text-3xl font-bold text-[#02343F]">Company Overview</h1>
        <div className="relative w-full md:w-1/3">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a company..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F0EDCC] text-[#02343F]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Company Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Account Count</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((row, index) => {
              const sno = startIdx + index + 1;
              return (
                <tr key={row.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-sm text-[#02343F]">{sno}</td>
                  <td className="px-6 py-4">
                    <span
                      onClick={() => router.push(`/dashboard?company=${encodeURIComponent(row.name)}`)}
                      className="inline-block px-3 py-1 rounded-full font-semibold cursor-pointer transition-all duration-200 text-[#02343F] hover:bg-[#02343F] hover:text-[#F0EDCC]"
                    >
                      {row.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-full font-semibold text-[#02343F]"
                    >
                      {row.number}
                    </div>
                  </td>

                </tr>
              );
            })}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t gap-4">
        <strong className="text-sm text-gray-700">
          Showing {paginatedData.length > 0 ? startIdx + 1 : 0} to{' '}
          {Math.min(startIdx + itemsPerPage, filteredData.length)} of {filteredData.length} companies
        </strong>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 disabled:bg-gray-300"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-900">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Popup */}
      {/* {selectedCompany && (
        <CompanyAnalyticsPopup
          companyName={selectedCompany.name}
          accountCount={selectedCompany.count}
          onClose={() => setSelectedCompany(null)}
        />
      )} */}
    </div>
  );
};

export default CompanySummaryTable;
