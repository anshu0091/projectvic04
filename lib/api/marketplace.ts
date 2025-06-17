import { CarbonCredit } from '@/lib/redux/slices/marketplaceSlice';

export interface ApiCarbonCredit {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  project_name: string;
  location: string;
  certification_body: string;
  vintage: string;
  image_url: string;
  seller: string;
  carbon_reduction: number;
  expiry_date?: string;
  category: 'renewable' | 'forestry' | 'agriculture' | 'waste' | 'other';
  status: 'available' | 'sold' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface UserCarbonCredit {
  id: string;
  user_id: string;
  credit_id: string;
  quantity: number;
  purchase_price: number;
  purchased_at: string;
  carbon_credits: {
    name: string;
    vintage: string;
    certification_body: string;
    carbon_reduction: number;
    category: string;
  };
}

export interface ApiTransaction {
  id: string;
  user_id: string;
  credit_id: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  status: 'completed' | 'pending' | 'failed';
  tx_hash?: string;
  created_at: string;
  carbon_credits: {
    name: string;
  };
}

// Transform API data to match Redux state structure
export const transformApiCreditToRedux = (apiCredit: ApiCarbonCredit): CarbonCredit => ({
  id: apiCredit.id,
  name: apiCredit.name,
  description: apiCredit.description,
  price: apiCredit.price,
  quantity: apiCredit.quantity,
  projectName: apiCredit.project_name,
  location: apiCredit.location,
  certificationBody: apiCredit.certification_body,
  vintage: apiCredit.vintage,
  imageUrl: apiCredit.image_url,
  seller: apiCredit.seller,
  carbonReduction: apiCredit.carbon_reduction,
  expiryDate: apiCredit.expiry_date,
  category: apiCredit.category,
  status: apiCredit.status
});

export const fetchCarbonCredits = async (filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  vintage?: string;
}): Promise<CarbonCredit[]> => {
  const params = new URLSearchParams();
  
  if (filters?.category) params.append('category', filters.category);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.location) params.append('location', filters.location);
  if (filters?.vintage) params.append('vintage', filters.vintage);

  const response = await fetch(`/api/carbon-credits?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch carbon credits');
  }

  const { data } = await response.json();
  return data.map(transformApiCreditToRedux);
};

export const fetchUserCarbonCredits = async (userId: string) => {
  const response = await fetch(`/api/user-credits?userId=${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user carbon credits');
  }

  const { data } = await response.json();
  return data;
};

export const fetchUserTransactions = async (userId: string) => {
  const response = await fetch(`/api/transactions?userId=${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user transactions');
  }

  const { data } = await response.json();
  return data;
};

export const createTransaction = async (transactionData: {
  userId: string;
  creditId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
}) => {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  const { data } = await response.json();
  return data;
};