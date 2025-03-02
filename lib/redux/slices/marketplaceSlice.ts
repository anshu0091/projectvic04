import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CarbonCredit {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  projectName: string;
  location: string;
  certificationBody: string;
  vintage: string;
  imageUrl: string;
  seller: string;
  tokenId?: string; // For future NFT integration
  carbonReduction: number; // in tons of CO2
  expiryDate?: string;
  category: 'renewable' | 'forestry' | 'agriculture' | 'waste' | 'other';
  status: 'available' | 'sold' | 'pending';
}

export interface MarketplaceState {
  listings: CarbonCredit[];
  filteredListings: CarbonCredit[];
  selectedListing: CarbonCredit | null;
  filters: {
    category: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    location: string | null;
    vintage: string | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: MarketplaceState = {
  listings: [
    {
      id: '1',
      name: 'Amazon Rainforest Conservation',
      description: 'Carbon credits from protecting the Amazon rainforest from deforestation.',
      price: 15.50,
      quantity: 1000,
      projectName: 'Amazon Preservation Initiative',
      location: 'Brazil',
      certificationBody: 'Verra',
      vintage: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2072&auto=format&fit=crop',
      seller: '0x1234...5678',
      carbonReduction: 1000,
      category: 'forestry',
      status: 'available'
    },
    {
      id: '2',
      name: 'Wind Farm Project',
      description: 'Credits generated from a wind farm project reducing fossil fuel dependency.',
      price: 12.75,
      quantity: 500,
      projectName: 'Clean Wind Energy',
      location: 'Germany',
      certificationBody: 'Gold Standard',
      vintage: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop',
      seller: '0x9876...4321',
      carbonReduction: 500,
      category: 'renewable',
      status: 'available'
    },
    {
      id: '3',
      name: 'Sustainable Agriculture',
      description: 'Carbon sequestration through sustainable farming practices.',
      price: 18.25,
      quantity: 750,
      projectName: 'Green Farming Initiative',
      location: 'India',
      certificationBody: 'Climate Action Reserve',
      vintage: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
      seller: '0xabcd...efgh',
      carbonReduction: 750,
      category: 'agriculture',
      status: 'available'
    },
    {
      id: '4',
      name: 'Methane Capture Project',
      description: 'Capturing methane emissions from waste management facilities.',
      price: 20.00,
      quantity: 300,
      projectName: 'Waste to Energy',
      location: 'United States',
      certificationBody: 'American Carbon Registry',
      vintage: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      seller: '0xijkl...mnop',
      carbonReduction: 300,
      category: 'waste',
      status: 'available'
    },
    {
      id: '5',
      name: 'Solar Power Plant',
      description: 'Credits from a large-scale solar power installation.',
      price: 14.50,
      quantity: 1200,
      projectName: 'Solar Energy Solutions',
      location: 'Australia',
      certificationBody: 'Verra',
      vintage: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop',
      seller: '0xqrst...uvwx',
      carbonReduction: 1200,
      category: 'renewable',
      status: 'available'
    },
    {
      id: '6',
      name: 'Mangrove Restoration',
      description: 'Restoring mangrove ecosystems for carbon sequestration and coastal protection.',
      price: 22.75,
      quantity: 600,
      projectName: 'Coastal Ecosystem Restoration',
      location: 'Indonesia',
      certificationBody: 'Plan Vivo',
      vintage: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?q=80&w=2071&auto=format&fit=crop',
      seller: '0xyzab...cdef',
      carbonReduction: 600,
      category: 'forestry',
      status: 'available'
    }
  ],
  filteredListings: [],
  selectedListing: null,
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    location: null,
    vintage: null,
  },
  loading: false,
  error: null,
};

export const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setListings: (state, action: PayloadAction<CarbonCredit[]>) => {
      state.listings = action.payload;
      state.filteredListings = applyFilters(action.payload, state.filters);
    },
    setSelectedListing: (state, action: PayloadAction<CarbonCredit | null>) => {
      state.selectedListing = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MarketplaceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredListings = applyFilters(state.listings, state.filters);
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredListings = state.listings;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addListing: (state, action: PayloadAction<CarbonCredit>) => {
      state.listings.push(action.payload);
      state.filteredListings = applyFilters(state.listings, state.filters);
    },
    updateListing: (state, action: PayloadAction<{ id: string, updates: Partial<CarbonCredit> }>) => {
      const { id, updates } = action.payload;
      const index = state.listings.findIndex(listing => listing.id === id);
      if (index !== -1) {
        state.listings[index] = { ...state.listings[index], ...updates };
        state.filteredListings = applyFilters(state.listings, state.filters);
        
        // Update selected listing if it's the one being updated
        if (state.selectedListing?.id === id) {
          state.selectedListing = { ...state.selectedListing, ...updates };
        }
      }
    },
    removeListing: (state, action: PayloadAction<string>) => {
      state.listings = state.listings.filter(listing => listing.id !== action.payload);
      state.filteredListings = applyFilters(state.listings, state.filters);
      
      // Clear selected listing if it's the one being removed
      if (state.selectedListing?.id === action.payload) {
        state.selectedListing = null;
      }
    }
  },
});

// Helper function to apply filters
const applyFilters = (listings: CarbonCredit[], filters: MarketplaceState['filters']) => {
  return listings.filter(listing => {
    // Category filter
    if (filters.category && listing.category !== filters.category) {
      return false;
    }
    
    // Price range filter
    if (filters.minPrice !== null && listing.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== null && listing.price > filters.maxPrice) {
      return false;
    }
    
    // Location filter
    if (filters.location && listing.location !== filters.location) {
      return false;
    }
    
    // Vintage filter
    if (filters.vintage && listing.vintage !== filters.vintage) {
      return false;
    }
    
    return true;
  });
};

export const { 
  setListings, 
  setSelectedListing, 
  setFilters, 
  resetFilters, 
  setLoading, 
  setError,
  addListing,
  updateListing,
  removeListing
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;