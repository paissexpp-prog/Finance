import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { UserWithPassword } from '@/lib/types';

/**
 * Manage Users Page - Owner can create and delete users
 * Features:
 * - Create new user account
 * - List all users
 * - Delete user account
 */
export default function ManageUsers() {
  const [users, setUsers] = useState<UserWithPassword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Failed to parse users:', error);
      }
    }
  }, []);

  // Save users to localStorage
  const saveUsers = (updatedUsers: UserWithPassword[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.username || !formData.password) {
        throw new Error('Username dan password harus diisi');
      }

      if (formData.username.length < 3) {
        throw new Error('Username minimal 3 karakter');
      }

      if (formData.password.length < 4) {
        throw new Error('Password minimal 4 karakter');
      }

      // Check if username already exists
      if (users.some(u => u.username === formData.username)) {
        throw new Error('Username sudah terdaftar');
      }

      const newUser: UserWithPassword = {
        id: `user-${Date.now()}`,
        username: formData.username,
        password: formData.password,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);

      toast.success(`User ${formData.username} berhasil dibuat`);
      setFormData({ username: '', password: '' });
      setShowForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal membuat user';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus user ${username}?`)) {
      const updatedUsers = users.filter(u => u.id !== userId);
      saveUsers(updatedUsers);
      toast.success(`User ${username} berhasil dihapus`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create User Form */}
      {showForm && (
        <Card className="p-6 border-0 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Buat User Baru</h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Membuat...
                  </span>
                ) : (
                  'Buat User'
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
                disabled={isLoading}
              >
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Create Button */}
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat User Baru
        </Button>
      )}

      {/* Users List */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar User</h3>
        {users.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-md">
            <p className="text-gray-500">Belum ada user terdaftar</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map(user => (
              <Card key={user.id} className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500">
                      Dibuat: {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
