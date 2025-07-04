import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#10b981', '#6366f1', '#f59e0b']; // green, indigo, amber

interface CompanyAnalyticsPopupProps {
  companyName: string;
  accountCount: number;
  onClose: () => void;
}

interface ApiAccount {
  status: string;
  companyName: string;
}

const CompanyAnalyticsPopup: React.FC<CompanyAnalyticsPopupProps> = ({
  companyName,
  accountCount,
  onClose,
}) => {
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get<ApiAccount[]>(
          'https://684fa5d6e7c42cfd17955990.mockapi.io/api/account-details/accountDetails'
        );

        const data = resp.data.filter(item => item.companyName === companyName);
        const counts = { active: 0, inactive: 0, closed: 0 };

        data.forEach(item => {
          const status = item.status?.toLowerCase(); // normalize to lowercase
          if (status === 'active') counts.active++;
          else if (status === 'inactive' || status === 'inactive') counts.inactive++;
          else if (status === 'closed') counts.closed++;
        });

        const result = [
          { label: 'Active', value: counts.active },
          { label: 'Inactive', value: counts.inactive },
          { label: 'Closed', value: counts.closed },
        ];

        setChartData(result);
      } catch (err) {
        console.error('Error fetching account details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyName]);

  return (
<div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-xl border border-gray-300 w-full max-w-md min-h-[400px] max-h-[90vh] overflow-auto transform transition-transform duration-300 ease-out scale-100">
    <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Company Analytics</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          <strong>Company:</strong> {companyName}<br />
          <strong>Total Accounts:</strong> {accountCount}
        </p>

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading chart...</p>
        ) : chartData.every(d => d.value === 0) ? (
          <p className="text-center py-10 text-gray-500">No data available</p>
        ) : (
          <div className="w-full h-64 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ label, value }) => `${label}: ${value}`}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={entry.label} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalyticsPopup;
