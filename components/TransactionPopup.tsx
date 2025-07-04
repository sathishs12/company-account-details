'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import html2canvas from 'html2canvas';

interface TransactionPopupProps {
  accountNo: string;
  accountStatus: 'active' | 'InActive' | 'closed';
  currentBalance: number;
  onClose: () => void;
}

const TransactionPopup: React.FC<TransactionPopupProps> = ({
  accountNo,
  accountStatus,
  currentBalance,
  onClose,
}) => {
  const [transactions, setTransactions] = useState<{ month: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const simulatedData =
      accountStatus === 'InActive' || accountStatus === 'closed'
        ? months.map((month) => ({ month, amount: 0 }))
        : months.map((month) => ({
            month,
            amount: Math.floor(Math.random() * 20000) + 500,
          }));

    setTimeout(() => {
      setTransactions(simulatedData);
      setLoading(false);
    }, 800);
  }, [accountNo, accountStatus]);

  const handleDownload = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = `${accountNo}_transactions.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl min-h-[500px] max-h-[90vh] overflow-auto p-6 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#02343F]">
              Monthly Transactions
            </h2>
            <div className="flex flex-wrap gap-6 text-sm text-black mt-1">
              <div>
                <span className="font-semibold">Account:</span> {accountNo}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <span
                  className={`capitalize font-semibold ${
                    accountStatus === 'active'
                      ? 'text-green-700'
                      : accountStatus === 'InActive'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {accountStatus}
                </span>
              </div>
              <div>
                <span className="font-semibold">Current Balance:</span>{' '}
                <span className="text-[#02343F] font-mono font-bold">
                  ₹{currentBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-black hover:text-[#02343F] text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="text-center py-24 text-[#02343F] font-semibold animate-pulse text-lg">
            Loading transactions...
          </div>
        ) : (
          <>
            <div className="w-full h-80" ref={chartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transactions}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="month" stroke="#000" />
                  <YAxis stroke="#000" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F0EDCC',
                      border: '1px solid #02343F',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      color: '#000',
                    }}
                    labelStyle={{ color: '#000' }}
                    itemStyle={{ color: '#000' }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#02343F', fontWeight: 'bold', fontSize: '14px' }}>
                        {value}
                      </span>
                    )}
                  />
                  <defs>
                    <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#02343F" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#F0EDCC" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="amount"
                    name="Amount (₹)"
                    fill="url(#gradientBar)"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDownload}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#02343F';
                  e.currentTarget.style.color = '#F0EDCC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F0EDCC';
                  e.currentTarget.style.color = '#02343F';
                }}
                style={{
                  backgroundColor: '#F0EDCC',
                  color: '#02343F',
                  transition: 'all 0.3s ease',
                }}
                className="px-4 py-2 text-sm font-semibold rounded-md border border-[#02343F]"
              >
                Download Chart as Image
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionPopup;
