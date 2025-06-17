import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserCarbonCredits, fetchUserTransactions, createTransaction } from '@/lib/api/marketplace';

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  creditId: string;
  creditName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string; // For blockchain transaction hash
}

export interface WalletState {
  balance: number;
  carbonCredits: {
    id: string;
    name: string;
    quantity: number;
    tokenId?: string; // For future NFT integration
    vintage: string;
    certificationBody: string;
    carbonReduction: number;
  }[];
  transactions: Transaction[];
  connected: boolean;
  address: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  balance: 10000, // Starting with demo balance
  carbonCredits: [],
  transactions: [],
  connected: false,
  address: null,
  loading: false,
  error: null
};

// Async thunks
export const fetchWalletData = createAsyncThunk(
  'wallet/fetchData',
  async (userId: string) => {
    const [userCredits, userTransactions] = await Promise.all([
      fetchUserCarbonCredits(userId),
      fetchUserTransactions(userId)
    ]);

    return {
      carbonCredits: userCredits.map((credit: any) => ({
        id: credit.credit_id,
        name: credit.carbon_credits.name,
        quantity: credit.quantity,
        vintage: credit.carbon_credits.vintage,
        certificationBody: credit.carbon_credits.certification_body,
        carbonReduction: credit.carbon_credits.carbon_reduction * credit.quantity
      })),
      transactions: userTransactions.map((tx: any) => ({
        id: tx.id,
        type: tx.type,
        creditId: tx.credit_id,
        creditName: tx.carbon_credits.name,
        quantity: tx.quantity,
        price: tx.price,
        totalAmount: tx.total_amount,
        timestamp: tx.created_at,
        status: tx.status,
        txHash: tx.tx_hash
      }))
    };
  }
);

export const purchaseCarbonCredit = createAsyncThunk(
  'wallet/purchaseCredit',
  async (data: {
    userId: string;
    creditId: string;
    creditName: string;
    quantity: number;
    price: number;
    vintage: string;
    certificationBody: string;
    carbonReduction: number;
  }) => {
    const transaction = await createTransaction({
      userId: data.userId,
      creditId: data.creditId,
      type: 'buy',
      quantity: data.quantity,
      price: data.price
    });

    return {
      transaction: {
        id: transaction.id,
        type: 'buy' as const,
        creditId: data.creditId,
        creditName: data.creditName,
        quantity: data.quantity,
        price: data.price,
        totalAmount: data.quantity * data.price,
        timestamp: transaction.created_at,
        status: transaction.status as 'completed' | 'pending' | 'failed'
      },
      carbonCredit: {
        id: data.creditId,
        name: data.creditName,
        quantity: data.quantity,
        vintage: data.vintage,
        certificationBody: data.certificationBody,
        carbonReduction: data.carbonReduction * data.quantity
      },
      totalCost: data.quantity * data.price
    };
  }
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    addCarbonCredits: (state, action: PayloadAction<WalletState['carbonCredits'][0]>) => {
      const existingIndex = state.carbonCredits.findIndex(credit => credit.id === action.payload.id);
      
      if (existingIndex !== -1) {
        // Update existing credit
        state.carbonCredits[existingIndex].quantity += action.payload.quantity;
      } else {
        // Add new credit
        state.carbonCredits.push(action.payload);
      }
    },
    removeCarbonCredits: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
      const { id, quantity } = action.payload;
      const existingIndex = state.carbonCredits.findIndex(credit => credit.id === id);
      
      if (existingIndex !== -1) {
        // Reduce quantity
        state.carbonCredits[existingIndex].quantity -= quantity;
        
        // Remove if quantity is 0 or less
        if (state.carbonCredits[existingIndex].quantity <= 0) {
          state.carbonCredits.splice(existingIndex, 1);
        }
      }
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload); // Add to beginning of array
    },
    updateTransaction: (state, action: PayloadAction<{ id: string, updates: Partial<Transaction> }>) => {
      const { id, updates } = action.payload;
      const index = state.transactions.findIndex(tx => tx.id === id);
      
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...updates };
      }
    },
    setWalletConnection: (state, action: PayloadAction<{ connected: boolean, address: string | null }>) => {
      const { connected, address } = action.payload;
      state.connected = connected;
      state.address = address;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // For demo purposes - sell carbon credit
    sellCarbonCredit: (state, action: PayloadAction<{ 
      creditId: string, 
      creditName: string, 
      quantity: number, 
      price: number 
    }>) => {
      const { creditId, creditName, quantity, price } = action.payload;
      const totalAmount = quantity * price;
      
      // Check if user has enough credits
      const existingIndex = state.carbonCredits.findIndex(credit => credit.id === creditId);
      
      if (existingIndex === -1 || state.carbonCredits[existingIndex].quantity < quantity) {
        return; // Not enough credits
      }
      
      // Add to balance
      state.balance += totalAmount;
      
      // Remove carbon credits from wallet
      state.carbonCredits[existingIndex].quantity -= quantity;
      
      // Remove if quantity is 0
      if (state.carbonCredits[existingIndex].quantity <= 0) {
        state.carbonCredits.splice(existingIndex, 1);
      }
      
      // Add transaction
      const transaction: Transaction = {
        id: `tx${Date.now()}`,
        type: 'sell',
        creditId,
        creditName,
        quantity,
        price,
        totalAmount,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      state.transactions.unshift(transaction);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.loading = false;
        state.carbonCredits = action.payload.carbonCredits;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchWalletData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wallet data';
      })
      .addCase(purchaseCarbonCredit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseCarbonCredit.fulfilled, (state, action) => {
        state.loading = false;
        
        // Deduct balance
        state.balance -= action.payload.totalCost;
        
        // Add carbon credits
        const existingIndex = state.carbonCredits.findIndex(
          credit => credit.id === action.payload.carbonCredit.id
        );
        
        if (existingIndex !== -1) {
          state.carbonCredits[existingIndex].quantity += action.payload.carbonCredit.quantity;
        } else {
          state.carbonCredits.push(action.payload.carbonCredit);
        }
        
        // Add transaction
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(purchaseCarbonCredit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to purchase carbon credit';
      });
  },
});

export const { 
  setBalance, 
  addCarbonCredits, 
  removeCarbonCredits, 
  addTransaction, 
  updateTransaction,
  setWalletConnection,
  setLoading,
  setError,
  sellCarbonCredit
} = walletSlice.actions;

export default walletSlice.reducer;