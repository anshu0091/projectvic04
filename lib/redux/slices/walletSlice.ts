import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  carbonCredits: [
    {
      id: '1',
      name: 'Amazon Rainforest Conservation',
      quantity: 10,
      vintage: '2024',
      certificationBody: 'Verra',
      carbonReduction: 10,
    },
    {
      id: '2',
      name: 'Wind Farm Project',
      quantity: 5,
      vintage: '2023',
      certificationBody: 'Gold Standard',
      carbonReduction: 5,
    }
  ],
  transactions: [
    {
      id: 'tx1',
      type: 'buy',
      creditId: '1',
      creditName: 'Amazon Rainforest Conservation',
      quantity: 10,
      price: 15.50,
      totalAmount: 155.00,
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: 'completed'
    },
    {
      id: 'tx2',
      type: 'buy',
      creditId: '2',
      creditName: 'Wind Farm Project',
      quantity: 5,
      price: 12.75,
      totalAmount: 63.75,
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: 'completed'
    }
  ],
  connected: false,
  address: null,
  loading: false,
  error: null
};

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
    // For demo purposes - buy carbon credit
    buyCarbonCredit: (state, action: PayloadAction<{ 
      creditId: string, 
      creditName: string, 
      quantity: number, 
      price: number,
      vintage: string,
      certificationBody: string,
      carbonReduction: number
    }>) => {
      const { creditId, creditName, quantity, price, vintage, certificationBody, carbonReduction } = action.payload;
      const totalAmount = quantity * price;
      
      // Check if user has enough balance
      if (state.balance < totalAmount) {
        return; // Not enough balance
      }
      
      // Deduct balance
      state.balance -= totalAmount;
      
      // Add carbon credits to wallet
      const existingIndex = state.carbonCredits.findIndex(credit => credit.id === creditId);
      
      if (existingIndex !== -1) {
        // Update existing credit
        state.carbonCredits[existingIndex].quantity += quantity;
      } else {
        // Add new credit
        state.carbonCredits.push({
          id: creditId,
          name: creditName,
          quantity,
          vintage,
          certificationBody,
          carbonReduction: carbonReduction * quantity
        });
      }
      
      // Add transaction
      const transaction: Transaction = {
        id: `tx${Date.now()}`,
        type: 'buy',
        creditId,
        creditName,
        quantity,
        price,
        totalAmount,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      state.transactions.unshift(transaction);
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
  buyCarbonCredit,
  sellCarbonCredit
} = walletSlice.actions;

export default walletSlice.reducer;