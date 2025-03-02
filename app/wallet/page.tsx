'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { sellCarbonCredit } from '@/lib/redux/slices/walletSlice';
import Image from 'next/image';
import Link from 'next/link';
import { Wallet, ArrowUpRight, TrendingUp, TrendingDown, Leaf, ChevronDown, X, Info, DollarSign, BarChart2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { NextPage } from 'next';

const WalletPage: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('credits');
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState(0);
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { balance, carbonCredits, transactions } = useAppSelector(state => state.wallet);
  
  const totalCarbonReduction = carbonCredits.reduce((acc, credit) => acc + credit.carbonReduction, 0);

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

  const openSellModal = (credit: any) => {
    setSelectedCredit(credit);
    setSellQuantity(1);
    setSellPrice(15); // Default price, in a real app this would be market price
    setShowSellModal(true);
  };

  const closeSellModal = () => {
    setShowSellModal(false);
    setSelectedCredit(null);
    setSellQuantity(1);
    setSellPrice(0);
  };

  const handleSell = () => {
    if (!selectedCredit) return;
    
    dispatch(sellCarbonCredit({
      creditId: selectedCredit.id,
      creditName: selectedCredit.name,
      quantity: sellQuantity,
      price: sellPrice
    }));
    
    closeSellModal();
    
    // Show success message
    alert(`Successfully sold ${sellQuantity} ${selectedCredit.name} credits!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Wallet Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">My Wallet</h1>
                <p className="text-gray-600">Manage your carbon credits and transactions</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/marketplace"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  Buy Credits <ArrowUpRight className="w-4 h-4" />
                </Link>
                <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <DollarSign className="w-4 h-4" />
                  Add Funds
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-emerald-600 font-bold text-2xl">${balance.toLocaleString()}</div>
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-sm text-gray-600">Available Balance</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-emerald-600 font-bold text-2xl">{carbonCredits.reduce((acc, credit) => acc + credit.quantity, 0)}</div>
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-sm text-gray-600">Carbon Credits</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-emerald-600 font-bold text-2xl">{totalCarbonReduction}</div>
                  <BarChart2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-sm text-gray-600">CO₂ Offset (tons)</div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('credits')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'credits'
                      ? 'border-b-2 border-emerald-600 text-emerald-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Carbon Credits
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'transactions'
                      ? 'border-b-2 border-emerald-600 text-emerald-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Transaction History
                </button>
                <button
                  onClick={() => setActiveTab('impact')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'impact'
                      ? 'border-b-2 border-emerald-600 text-emerald-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Environmental Impact
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* Carbon Credits Tab */}
              {activeTab === 'credits' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Your Carbon Credits</h2>
                    <div className="text-sm text-gray-600">
                      Total: {carbonCredits.reduce((acc, credit) => acc + credit.quantity, 0)} credits
                    </div>
                  </div>
                  
                  {carbonCredits.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No carbon credits yet</h3>
                      <p className="text-gray-600 mb-6">
                        Start your sustainability journey by purchasing carbon credits.
                      </p>
                      <Link
                        href="/marketplace"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium inline-flex items-center gap-2 transition-colors"
                      >
                        Browse Marketplace <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Credit Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Vintage</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Certification</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">CO₂ Offset</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {carbonCredits.map(credit => (
                            <tr key={credit.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{credit.name}</td>
                              <td className="py-3 px-4">{credit.quantity}</td>
                              <td className="py-3 px-4">{credit.vintage}</td>
                              <td className="py-3 px-4">{credit.certificationBody}</td>
                              <td className="py-3 px-4">{credit.carbonReduction} tons</td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openSellModal(credit)}
                                    className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                                  >
                                    Sell
                                  </button>
                                  <button
                                    onClick={() => alert(`Certificate for ${credit.name} would be downloaded here.`)}
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                                  >
                                    Certificate
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              
              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Transaction History</h2>
                    <div className="text-sm text-gray-600">
                      Total: {transactions.length} transactions
                    </div>
                  </div>
                  
                  {transactions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                      <p className="text-gray-600 mb-6">
                        Your transaction history will appear here once you start trading.
                      </p>
                      <Link
                        href="/marketplace"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium inline-flex items-center gap-2 transition-colors"
                      >
                        Browse Marketplace <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Credit</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map(tx => (
                            <tr key={tx.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 text-gray-600">
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </td>
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
                              <td className="py-3 px-4 font-medium">{tx.creditName}</td>
                              <td className="py-3 px-4">{tx.quantity}</td>
                              <td className="py-3 px-4">${tx.price.toFixed(2)}</td>
                              <td className="py-3 px-4 font-medium">${tx.totalAmount.toFixed(2)}</td>
                              <td className="py-3 px-4">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              
              {/* Impact Tab */}
              {activeTab === 'impact' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Your Environmental Impact</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Carbon Offset</h3>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Leaf className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total CO₂ Offset</p>
                          <p className="text-3xl font-bold text-emerald-600">{totalCarbonReduction} tons</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">Trees Equivalent</span>
                            <span className="font-medium">{Math.round(totalCarbonReduction * 2.5)} trees</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, totalCarbonReduction / 10)}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">Car Emissions Avoided</span>
                            <span className="font-medium">{Math.round(totalCarbonReduction * 2.3)} miles</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, totalCarbonReduction * 2.3 / 100)}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">Household Energy Saved</span>
                            <span className="font-medium">{Math.round(totalCarbonReduction * 1.2)} kWh</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, totalCarbonReduction * 1.2 / 50)}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Impact Certificates</h3>
                      {carbonCredits.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">
                            You don't have any impact certificates yet. Purchase carbon credits to receive certificates.
                          </p>
                          <Link
                            href="/marketplace"
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            Browse Marketplace →
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {carbonCredits.map(credit => (
                            <div key={credit.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{credit.name}</h4>
                                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">
                                  {credit.quantity} credits
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mb-3">
                                {credit.carbonReduction} tons CO₂ offset
                              </div>
                              <button
                                onClick={() => alert(`Certificate for ${credit.name} would be downloaded here.`)}
                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                              >
                                Download Certificate →
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Sustainability Goals</h3>
                    <p className="text-gray-600 mb-6">
                      Track your progress towards your personal sustainability goals and see how your carbon credit purchases are making a difference.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Annual Offset Goal</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium">{totalCarbonReduction}/100 tons</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, totalCarbonReduction)}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {totalCarbonReduction >= 100 ? 'Goal achieved!' : `${100 - totalCarbonReduction} tons to go`}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Project Diversity</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium">
                            {new Set(carbonCredits.map(c => c.name)).size}/5 projects
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, new Set(carbonCredits.map(c => c.name)).size * 20)}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Support diverse project types for maximum impact
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Consistency</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium">
                            {Math.min(12, transactions.length)}/12 months
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, transactions.length * 8.33)}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Regular purchases throughout the year
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Sell Modal */}
      {showSellModal && selectedCredit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Sell Carbon Credits</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Credit:</span>
                  <span className="font-medium">{selectedCredit.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium">{selectedCredit.quantity} credits</span>
                </div>
                <div className="border-t pt-4 mb-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity to Sell
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                      className="px-3 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={selectedCredit.quantity}
                      value={sellQuantity}
                      onChange={(e) => setSellQuantity(Math.min(selectedCredit.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center py-1 border-t border-b border-gray-300 focus:outline-none"
                    />
                    <button
                      onClick={() => setSellQuantity(Math.min(selectedCredit.quantity, sellQuantity + 1))}
                      className="px-3 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Credit ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    min="0.01"
                    step="0.01"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Math.max(0.01, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between font-bold">
                    <span>Total Amount:</span>
                    <span>${(sellPrice * sellQuantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSell}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Confirm Sale
                </button>
                <button
                  onClick={closeSellModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletPage;