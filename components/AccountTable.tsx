"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IAccount } from "@/types";
import * as XLSX from "xlsx";
import { ArrowDownTrayIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import StatusCell from "./grid-cells/StatusCell";
import ActionsCell from "./grid-cells/ActionsCell";
import TransactionPopup from ".//TransactionPopup";

const AccountTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyName = searchParams.get("company") ?? "";

  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<IAccount["status"] | "">("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [hover, setHover] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{
    accountNo: string;
    status: "active" | "InActive" | "closed";
    currentBalance: number;
  } | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://684fa5d6e7c42cfd17955990.mockapi.io/api/account-details/accountDetails");
        const data = await response.json();
        setAccounts(data);
      } catch (err) {
        console.error("Error fetching account data:", err);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return accounts
      .filter((a) => a.companyName === companyName)
      .filter((a) => a.name.toLowerCase().includes(searchText.toLowerCase()))
      .filter((a) => (selectedStatus ? a.status === selectedStatus : true))
      .filter((a) =>
        selectedDate
          ? new Date(a.updatedAt).toLocaleDateString("en-US") ===
            new Date(selectedDate).toLocaleDateString("en-US")
          : true
      );
  }, [accounts, companyName, selectedDate, selectedStatus, searchText]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  const downloadExcel = (data: IAccount[], filename: string) => {
    const dataToExport = data.map(({ avatar, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="flex flex-col shadow-md sm:rounded-lg bg-white">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-[#02343F]">{companyName} Dashboard</h1>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-2 py-1.5 rounded-md shadow-sm w-full sm:w-auto text-black"
            />

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as IAccount["status"] | "");
                setCurrentPage(1);
              }}
              className="border px-2 py-1.5 rounded-md shadow-sm w-full sm:w-auto text-black"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="InActive">InActive</option>
              <option value="closed">Closed</option>
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-2 py-1.5 rounded-md shadow-sm w-full sm:w-auto text-black"
            />

            <button
              disabled={!selectedDate && !selectedStatus && !searchText}
              onClick={() => {
                setSelectedDate("");
                setSelectedStatus("");
                setSearchText("");
                setCurrentPage(1);
              }}
              className="px-4 py-1.5 rounded-md bg-gray-800 text-white hover:bg-gray-500 disabled:bg-gray-300"
            >
              Clear
            </button>

            <button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => downloadExcel(filteredData, `${companyName.replace(/\s+/g, "_")}_accounts.xlsx`)}
              style={{
                color: hover ? "#02343F" : "#F0EDCC",
                backgroundColor: hover ? "#F0EDCC" : "#02343F",
              }}
              className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-md w-full sm:w-auto"
            >
              <ArrowDownTrayIcon className="h-5 w-5" /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F0EDCC] h-[50]">
            <tr className="text-[#02343F] text-base font-bold">
              <th className="px-4 py-2">S.NO</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Account No</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Last Updated</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((account, index) => {
              const date = new Date(account.updatedAt);
              const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              return (
                <tr key={account.id} className="hover:bg-gray-50 h-[60]">
                  <td className="px-4 py-2 text-sm text-[#02343F] font-bold">{startIdx + index + 1}</td>
                  <td className="px-4 py-2 text-base text-[#02343F] font-semibold">{account.name}</td>
                  <td className="px-4 py-2">
                    <span
                      onClick={() => {
                        const normalizedStatus =
                          account.status === 'inactive' ? 'InActive' : account.status;
                        setSelectedAccount({
                          accountNo: account.accountNo,
                          status: normalizedStatus as 'active' | 'InActive' | 'closed',
                          currentBalance: account.currentBalance,
                        });
                        setShowPopup(true);
                      }}
                      className="cursor-pointer px-2 py-1 rounded text-sm font-semibold transition-colors text-[#02343F] hover:bg-[#02343F] hover:text-[#F0EDCC]"
                    >
                      {account.accountNo}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-[#02343F] font-semibold">₹{Number(account.currentBalance).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-2">
                    <StatusCell value={account.status} />
                  </td>
                  <td className="px-4 py-2 text-sm text-center text-[#02343F] font-semibold">{formattedDate}</td>
                  <td className="px-4 py-2 text-center">
                    <ActionsCell data={account} />
                  </td>
                </tr>
              );
            })}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t gap-4">
        <strong className="text-sm text-gray-700">
          Showing {paginatedData.length} of {filteredData.length} records
        </strong>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-semibold"
        >
          <ArrowUturnLeftIcon className="h-5 w-5" /> Back
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 disabled:bg-gray-300"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
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

      {showPopup && selectedAccount && (
        <TransactionPopup
          accountNo={selectedAccount.accountNo}
          accountStatus={selectedAccount.status}
          currentBalance={selectedAccount.currentBalance}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default AccountTable;