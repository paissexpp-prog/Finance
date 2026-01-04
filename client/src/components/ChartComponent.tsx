import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Transaction } from '@/lib/types';

interface ChartComponentProps {
  transactions: Transaction[];
  type: '7days' | '30days' | '1year';
  chartType?: 'line' | 'bar' | 'pie';
}

/**
 * Chart Component - Display transaction data with Recharts
 * Supports multiple time ranges and chart types
 */
export const ChartComponent = ({ transactions, type, chartType = 'line' }: ChartComponentProps) => {
  const chartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let groupBy: 'day' | 'week' | 'month';

    switch (type) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case '1year':
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = 'month';
        break;
    }

    // Filter transactions within date range
    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= now;
    });

    // Group transactions by period
    const grouped: { [key: string]: { income: number; expense: number } } = {};

    filtered.forEach(tx => {
      const txDate = new Date(tx.date);
      let key: string;

      if (groupBy === 'day') {
        key = txDate.toISOString().split('T')[0];
      } else if (groupBy === 'month') {
        key = txDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
      } else {
        key = `Week ${Math.ceil(txDate.getDate() / 7)}`;
      }

      if (!grouped[key]) {
        grouped[key] = { income: 0, expense: 0 };
      }

      if (tx.type === 'income') {
        grouped[key].income += tx.amount;
      } else {
        grouped[key].expense += tx.amount;
      }
    });

    // Convert to array and fill missing dates
    let data = Object.entries(grouped).map(([date, values]) => ({
      date,
      income: values.income,
      expense: values.expense,
      net: values.income - values.expense,
    }));

    // Fill missing dates for line/bar charts
    if (groupBy === 'day' && type !== '1year') {
      const allDates: { [key: string]: boolean } = {};
      for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        allDates[dateStr] = true;
      }

      data = Object.keys(allDates)
        .sort()
        .map(date => {
          const existing = data.find(d => d.date === date);
          return existing || { date, income: 0, expense: 0, net: 0 };
        });
    }

    return data;
  }, [transactions, type]);

  const COLORS = ['#10B981', '#EF4444'];

  if (chartData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg text-gray-500">
        Tidak ada data untuk periode ini
      </div>
    );
  }

  if (chartType === 'pie') {
    const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
    const totalExpense = chartData.reduce((sum, d) => sum + d.expense, 0);

    const pieData = [
      { name: 'Pemasukan', value: totalIncome },
      { name: 'Pengeluaran', value: totalExpense },
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: Rp${(value / 1000000).toFixed(1)}M`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              `Rp${new Intl.NumberFormat('id-ID').format(value)}`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            formatter={(value: number) =>
              `Rp${new Intl.NumberFormat('id-ID').format(value)}`
            }
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="income" fill="#10B981" name="Pemasukan" />
          <Bar dataKey="expense" fill="#EF4444" name="Pengeluaran" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Default: Line chart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          formatter={(value: number) =>
            `Rp${new Intl.NumberFormat('id-ID').format(value)}`
          }
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: '#10B981', r: 4 }}
          activeDot={{ r: 6 }}
          name="Pemasukan"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#EF4444"
          strokeWidth={2}
          dot={{ fill: '#EF4444', r: 4 }}
          activeDot={{ r: 6 }}
          name="Pengeluaran"
        />
        <Line
          type="monotone"
          dataKey="net"
          stroke="#0066FF"
          strokeWidth={2}
          dot={{ fill: '#0066FF', r: 4 }}
          activeDot={{ r: 6 }}
          name="Net"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
