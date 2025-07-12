export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  isPublic: boolean;
  averageRating: number;
  reviewCount: number;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  offeredSkill: string;
  wantedSkill: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export interface AppState {
  users: User[];
  swapRequests: SwapRequest[];
  loading: boolean;
  searchQuery: string;
  availabilityFilter: string;
  setUsers: (users: User[]) => void;
  setSwapRequests: (requests: SwapRequest[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setAvailabilityFilter: (filter: string) => void;
  fetchUsers: () => Promise<void>;
  fetchSwapRequests: (token: string) => Promise<void>;
  addSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>, token: string) => Promise<void>;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>, token: string) => Promise<void>;
}