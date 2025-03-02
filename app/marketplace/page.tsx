'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { CarbonCredit, setSelectedListing, setFilters, resetFilters } from '@/lib/redux/slices/marketplaceSlice';
import { buyCarbonCredit } from '@/lib/redux/slices/walletSlice';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, Search, Leaf, ArrowUpRight, ChevronDown, X, Info, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Marketplace() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedListing, setSelectedListingState] = useState<CarbonCredit | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { listings } = useAppSelector(state => state.marketplace);
  const { balance } = useAppSelector(state => state.wallet);
  
  // Filter listings based on search term and category
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || listing.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    dispatch(setFilters({ category }));
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    dispatch(resetFilters());
  };

  const openPurchaseModal = (listing: CarbonCredit) => {
    setSelectedListingState(listing);
    setPurchaseQuantity(1);
    setShowPurchaseModal(true);
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedListingState(null);
    setPurchaseQuantity(1);
  };

  const handlePurchase = () => {
    if (!selectedListing) return;
    
    const totalCost = selectedListing.price * purchaseQuantity;
    
    if (balance < totalCost) {
      alert('Insufficient balance. Please add funds to your wallet.');
      return;
    }
    
    dispatch(buyCarbonCredit({
      creditId: selectedListing.id,
      creditName: selectedListing.name,
      quantity: purchaseQuantity,
      price: selectedListing.price,
      vintage: selectedListing.vintage,
      certificationBody: selectedListing.certificationBody,
      carbonReduction: selectedListing.carbonReduction
    }));
    
    closePurchaseModal();
    
    // Show success message
    alert(`Successfully purchased ${purchaseQuantity} ${selectedListing.name} credits!`);
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
          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <div className="absolute inset-0 -z-10">
              <Image
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
                alt="Carbon Credits Marketplace"
                fill
                className="object-cover brightness-50"
              />
            </div>
            <div className="py-16 px-8 md:py-24 md:px-12">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Carbon Credits Marketplace
                </h1>
                <p className="text-lg text-gray-200 mb-6">
                  Browse and purchase verified carbon credits from projects around the world. Make a real impact on climate change.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => window.scrollTo({ top: document.getElementById('listings')?.offsetTop || 0 - 100, behavior: 'smooth' })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 transition-colors"
                  >
                    Browse Credits <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 backdrop-blur-sm transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search carbon credits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                {(selectedCategory || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === null
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleCategorySelect('renewable')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === 'renewable'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Renewable Energy
                  </button>
                  <button
                    onClick={() => handleCategorySelect('forestry')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === 'forestry'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Forestry
                  </button>
                  <button
                    onClick={() => handleCategorySelect('agriculture')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === 'agriculture'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Agriculture
                  </button>
                  <button
                    onClick={() => handleCategorySelect('waste')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === 'waste'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Waste Management
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Listings */}
          <div id="listings" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Available Carbon Credits</h2>
              <div className="text-sm text-gray-600">
                Showing {filteredListings.length} of {listings.length} credits
              </div>
            </div>
            
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No carbon credits found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={listing.imageUrl}
                        alt={listing.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          listing.category === 'renewable' ? 'bg-blue-100 text-blue-800' :
                          listing.category === 'forestry' ? 'bg-green-100 text-green-800' :
                          listing.category === 'agriculture' ? 'bg-yellow-100 text-yellow-800' :
                          listing.category === 'waste' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{listing.name}</h3>
                        <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-medium">
                          ${listing.price.toFixed(2)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        <span>{listing.carbonReduction} tons CO₂ offset</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-500">Location</div>
                          <div className="font-medium">{listing.location}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-500">Vintage</div>
                          <div className="font-medium">{listing.vintage}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-500">Certification</div>
                          <div className="font-medium">{listing.certificationBody}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-500">Available</div>
                          <div className="font-medium">{listing.quantity.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openPurchaseModal(listing)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy Now
                        </button>
                        <button
                          onClick={() => {
                            dispatch(setSelectedListing(listing));
                            // In a real app, this would navigate to a detail page
                            alert(`Viewing details for ${listing.name}`);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Info className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">About Carbon Credits</h2>
            <p className="text-gray-600 mb-4">
              Carbon credits represent the reduction, avoidance, or removal of greenhouse gas emissions from the atmosphere. Each credit represents one metric ton of carbon dioxide equivalent (CO2e) that is either prevented from being emitted or removed from the atmosphere.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Verification</h3>
                <p className="text-sm text-gray-600">
                  All carbon credits on our platform are verified by recognized certification bodies to ensure their legitimacy and impact.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-sm text-gray-600">
                  Blockchain technology ensures complete transparency and traceability for all carbon credit transactions.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Impact</h3>
                <p className="text-sm text-gray-600">
                  By purchasing carbon credits, you directly support projects that reduce greenhouse gas emissions and combat climate change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Purchase Modal */}
      {showPurchaseModal && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Purchase Carbon Credits</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Credit:</span>
                  <span className="font-medium">{selectedListing.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Price per Credit:</span>
                  <span className="font-medium">${selectedListing.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Your Balance:</span>
                  <span className="font-medium">${balance.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4 mb-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                      className="px-3 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={selectedListing.quantity}
                      value={purchaseQuantity}
                      onChange={(e) => setPurchaseQuantity(Math.min(selectedListing.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center py-1 border-t border-b border-gray-300 focus:outline-none"
                    />
                    <button
                      onClick={() => setPurchaseQuantity(Math.min(selectedListing.quantity, purchaseQuantity + 1))}
                      className="px-3 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${(selectedListing.price * purchaseQuantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold">
                    <span>Total:</span>
                    <span>${(selectedListing.price * purchaseQuantity).toFixed(2)}</span>
                  </div>
                </div>
                {balance < selectedListing.price * purchaseQuantity && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                    Insufficient balance. Please add funds to your wallet.
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePurchase}
                  disabled={balance < selectedListing.price * purchaseQuantity}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Confirm Purchase
                </button>
                <button
                  onClick={closePurchaseModal}
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