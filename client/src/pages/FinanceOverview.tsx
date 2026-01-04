import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ChartComponent } from '@/components/ChartComponent';

/**
 * Finance Overview Page - Dashboard with statistics and charts
 * Shows:
 * - Monthly balance (resets monthly)
 * - Monthly expenses (resets monthly)
 * - Yearly total expenses (never resets)
 * - Charts for 7 days, 30 days, 1 year
 */
export default function FinanceOverview() {
  const { user } = useAuth();
  const { getTransactionsByUser } = useTransactions();
  const [chartType, setChartType] = useState('line');

  const transactions = useMemo(() => {
    return user ? getTransactionsByUser(user.id) : [];
  }, [user, getTransactionsByUser]);

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Monthly transactions
    const monthlyTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    // Yearly transactions
    const yearlyTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getFullYear() === currentYear;
    });

    // Calculate totals
    const monthlyIncome = monthlyTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const monthlyExpense = monthlyTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const monthlyBalance = monthlyIncome - monthlyExpense;

    const yearlyExpense = yearlyTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      monthlyBalance,
      monthlyIncome,
      monthlyExpense,
      yearlyExpense,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Balance Card */}
        <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Saldo Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.monthlyBalance)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Reset setiap bulan</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Monthly Income Card */}
        <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pemasukan Bulan Ini</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                +{formatCurrency(stats.monthlyIncome)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Total pemasukan</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Monthly Expense Card */}
        <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pengeluaran Bulan Ini</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                -{formatCurrency(stats.monthlyExpense)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Reset setiap bulan</p>
            </div>
            <div className="p-3 bg-red-600 rounded-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Yearly Expense Card */}
        <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Pengeluaran Tahun</p>
              <p className="text-2xl font-bold text-amber-600 mt-2">
                -{formatCurrency(stats.yearlyExpense)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Tidak di-reset</p>
            </div>
            <div className="p-3 bg-amber-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Chart Type Selector */}
        <div className="flex gap-2 flex-wrap">
          {['line', 'bar', 'pie'].map(type => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                chartType === type
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'line' ? 'Garis' : type === 'bar' ? 'Batang' : 'Pie'}
            </button>
          ))}
        </div>

        {/* 7 Days Chart */}
        <Card className="p-6 border-0 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Grafik 7 Hari Terakhir</h3>
          <ChartComponent transactions={transactions} type="7days" chartType={chartType as any} />
        </Card>

        {/* 30 Days Chart */}
        <Card className="p-6 border-0 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Grafik 30 Hari Terakhir</h3>
          <ChartComponent transactions={transactions} type="30days" chartType={chartType as any} />
        </Card>

        {/* 1 Year Chart */}
        <Card className="p-6 border-0 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Grafik 1 Tahun Terakhir</h3>
          <ChartComponent transactions={transactions} type="1year" chartType={chartType as any} />
        </Card>
      </div>
    </div>
  );
}
