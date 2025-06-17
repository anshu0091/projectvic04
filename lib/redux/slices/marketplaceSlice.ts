import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCarbonCredits } from '@/lib/api/marketplace';

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
  listings: [],
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

// Async thunk for fetching carbon credits
export const fetchMarketplaceData = createAsyncThunk(
  'marketplace/fetchData',
  async (filters?: MarketplaceState['filters']) => {
    const cleanFilters = filters ? Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null)
    ) : undefined;
    
    return await fetchCarbonCredits(cleanFilters);
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketplaceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaceData.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
        state.filteredListings = applyFilters(action.payload, state.filters);
      })
      .addCase(fetchMarketplaceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch marketplace data';
      });
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