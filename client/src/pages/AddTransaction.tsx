import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddTransactionProps {
  onSuccess: () => void;
}

/**
 * Add Transaction Page - Form to add new transaction
 * Features:
 * - Select transaction type (income/expense)
 * - Input amount and description
 * - Select date
 */
export default function AddTransaction({ onSuccess }: AddTransactionProps) {
  const { user } = useAuth();
  const { addTransaction } = useTransactions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) throw new Error('User not found');
      if (!formData.amount || !formData.description) {
        throw new Error('Semua field harus diisi');
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Jumlah harus berupa angka positif');
      }

      addTransaction({
        userId: user.id,
        type: formData.type,
        amount,
        description: formData.description,
        date: formData.date,
      });

      toast.success('Transaksi berhasil ditambahkan');
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menambah transaksi';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Card className="p-8 border-0 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Catat Transaksi Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Jenis Transaksi</label>
            <div className="flex gap-4">
              {['income', 'expense'].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })
                    }
                    className="w-4 h-4"
                  />
                  <span className={`font-medium ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Jumlah (Rp)
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              disabled={isSubmitting}
              className="h-11"
              min="0"
              step="1000"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Keterangan
            </label>
            <Input
              id="description"
              type="text"
              placeholder="Contoh: Gaji bulanan, Makan siang, dll"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSubmitting}
              className="h-11"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Tanggal
            </label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              disabled={isSubmitting}
              className="h-11"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                'Simpan Transaksi'
              )}
            </Button>
            <Button
              type="button"
              onClick={onSuccess}
              variant="outline"
              className="flex-1 h-11"
              disabled={isSubmitting}
            >
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
