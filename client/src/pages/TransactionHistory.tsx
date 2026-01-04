import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface TransactionHistoryProps {
  onEdit: (id: string) => void;
}

/**
 * Transaction History Page - Display all transactions
 * Features:
 * - Filter by type (All, Income, Expense)
 * - Edit and delete transactions
 * - Sort by date
 */
export default function TransactionHistory({ onEdit }: TransactionHistoryProps) {
  const { user } = useAuth();
  const { getTransactionsByUser, deleteTransaction } = useTransactions();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const transactions = useMemo(() => {
    const userTransactions = user ? getTransactionsByUser(user.id) : [];
    
    let filtered = userTransactions;
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [user, getTransactionsByUser, filterType]);

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      deleteTransaction(id);
      toast.success('Transaksi berhasil dihapus');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        {['all', 'income', 'expense'].map(type => (
          <Button
            key={type}
            onClick={() => setFilterType(type as 'all' | 'income' | 'expense')}
            variant={filterType === type ? 'default' : 'outline'}
            className={`${
              filterType === type
                ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                : ''
            }`}
          >
            {type === 'all' ? 'Semua' : type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </Button>
        ))}
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <Card className="p-12 text-center border-0 shadow-md">
          <p className="text-gray-500 text-lg">Belum ada transaksi</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {transactions.map(tx => (
            <Card
              key={tx.id}
              className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`p-3 rounded-lg ${
                      tx.type === 'income'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{tx.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onEdit(tx.id)}
                      size="sm"
                      variant="outline"
                      className="p-2 h-auto"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(tx.id)}
                      size="sm"
                      variant="outline"
                      className="p-2 h-auto text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
