import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, BarChart3, History, Plus, Users } from 'lucide-react';
import FinanceOverview from '@/pages/FinanceOverview';
import TransactionHistory from '@/pages/TransactionHistory';
import AddTransaction from '@/pages/AddTransaction';
import EditTransaction from '@/pages/EditTransaction';
import ManageUsers from '@/pages/ManageUsers';

/**
 * Dashboard Layout - Minimalist Fintech Design
 * Features:
 * - Sticky sidebar navigation
 * - Role-based menu items (owner vs user)
 * - Mobile responsive with hamburger menu
 * - Smooth transitions between sections
 */
export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: BarChart3,
      visible: true,
    },
    {
      id: 'history',
      label: 'Riwayat Transaksi',
      icon: History,
      visible: true,
    },
    {
      id: 'add-transaction',
      label: 'Catat Transaksi',
      icon: Plus,
      visible: true,
    },
    {
      id: 'manage-users',
      label: 'Kelola User',
      icon: Users,
      visible: user?.role === 'owner',
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <FinanceOverview />;
      case 'history':
        return <TransactionHistory onEdit={(id: string) => {
          setEditingTransactionId(id);
          setCurrentPage('edit-transaction');
        }} />;
      case 'add-transaction':
        return <AddTransaction onSuccess={() => handleNavigation('overview')} />;
      case 'edit-transaction':
        return <EditTransaction 
          transactionId={editingTransactionId || null} 
          onSuccess={() => handleNavigation('history')}
          onCancel={() => handleNavigation('history')}
        />;
      case 'manage-users':
        return <ManageUsers />;
      default:
        return <FinanceOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl">
                <span className="text-lg font-bold text-white">₹</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Finance</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{user?.username}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {user?.role === 'owner' ? 'Owner' : 'User'}
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems
              .filter(item => item.visible)
              .map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-10 border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl font-bold text-gray-900">
                {menuItems.find(item => item.id === currentPage)?.label}
              </h2>
            </div>
            <div className="w-10" />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="animate-fade-in">
            {renderPage()}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
