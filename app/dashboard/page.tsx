'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, User, Settings, CreditCard, BarChart2, FileText, ShoppingCart, Wallet, Leaf, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { balance, carbonCredits, transactions } = useAppSelector(state => state.wallet);
  const totalCarbonReduction = carbonCredits.reduce((acc, credit) => acc + credit.carbonReduction, 0);
  const totalCredits = carbonCredits.reduce((acc, credit) => acc + credit.quantity, 0);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://freecoins24.io/wp-content/uploads/2024/07/dtxm4BGB_400x400.jpg"
                alt="Vectorium"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl font-bold">Vectorium</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {user?.email}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex flex-col items-center p-4 border-b">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium">{user?.email}</h3>
                <p className="text-sm text-gray-500">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
              </div>
              <nav className="mt-4 space-y-2">
                <a href="#" className="flex items-center gap-3 p-3 text-emerald-600 bg-emerald-50 rounded-md">
                  <BarChart2 className="w-5 h-5" />
                  <span>Dashboard</span>
                </a>
                <Link href="/marketplace" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-md">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Marketplace</span>
                </Link>
                <Link href="/wallet" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-md">
                  <Wallet className="w-5 h-5" />
                  <span>My Wallet</span>
                </Link>
                <a href="#" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-md">
                  <FileText className="w-5 h-5" />
                  <span>Transactions</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-md">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-emerald-600 font-bold text-2xl">{totalCredits}</div>
                    <Wallet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-sm text-gray-600">Carbon Credits</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-emerald-600 font-bold text-2xl">${balance.toLocaleString()}</div>
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-sm text-gray-600">Balance</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-emerald-600 font-bold text-2xl">{totalCarbonReduction}</div>
                    <Leaf className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-sm text-gray-600">CO₂ Offset (tons)</div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No transactions yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Credit</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map(tx => (
                          <tr key={tx.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className={`flex items-center gap-2 ${
                                tx.type === 'buy' ? 'text-emerald-600' : 'text-orange-500'
                              }`}>
                                {tx.type === 'buy' ? (
                                  <TrendingDown className="w-5 h-5" />
                                ) : (
                                  <TrendingUp className="w-5 h-5" />
                                )}
                                <span className="capitalize">{tx.type}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{tx.creditName}</td>
                            <td className="py-3 px-4 font-medium">${tx.totalAmount.toFixed(2)}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-4 text-right">
                  <Link href="/wallet" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 justify-end">
                    View all transactions
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Carbon Impact</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total CO₂ Offset</p>
                    <p className="text-2xl font-bold text-emerald-600">{totalCarbonReduction} tons</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trees Equivalent</span>
                    <span className="font-medium">{Math.round(totalCarbonReduction * 2.5)} trees</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, totalCarbonReduction / 10)}%` }}></div>
                  </div>
                </div>
                <Link href="/wallet" className="mt-6 inline-block text-emerald-600 hover:text-emerald-700 font-medium">
                  View detailed impact →
                </Link>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/marketplace" className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
                    <ShoppingCart className="w-8 h-8 text-emerald-600 mb-2" />
                    <h4 className="font-medium">Buy Credits</h4>
                    <p className="text-xs text-gray-600 mt-1">Purchase verified carbon credits</p>
                  </Link>
                  <Link href="/wallet" className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
                    <Wallet className="w-8 h-8 text-emerald-600 mb-2" />
                    <h4 className="font-medium">Manage Wallet</h4>
                    <p className="text-xs text-gray-600 mt-1">View and sell your credits</p>
                  </Link>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
                    <CreditCard className="w-8 h-8 text-emerald-600 mb-2" />
                    <h4 className="font-medium">Add Funds</h4>
                    <p className="text-xs text-gray-600 mt-1">Top up your balance</p>
                  </div>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
                    <FileText className="w-8 h-8 text-emerald-600 mb-2" />
                    <h4 className="font-medium">Certificates</h4>
                    <p className="text-xs text-gray-600 mt-1">Download impact certificates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}