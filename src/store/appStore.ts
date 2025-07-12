import { create } from 'zustand';
import { AppState, User, SwapRequest } from '../types';
import { API_BASE_URL } from '../config/api';

export const useAppStore = create<AppState>((set, get) => ({
  users: [],
  swapRequests: [],
  loading: false,
  searchQuery: '',
  availabilityFilter: '',

  setUsers: (users: User[]) => set({ users }),
  setSwapRequests: (requests: SwapRequest[]) => set({ swapRequests: requests }),
  setLoading: (loading: boolean) => set({ loading }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setAvailabilityFilter: (filter: string) => set({ availabilityFilter: filter }),

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const users = await res.json();
      set({ users });
    } finally {
      set({ loading: false });
    }
  },

  fetchSwapRequests: async (token: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/swaps/my-swaps`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch swap requests');
      const swapRequests = await res.json();
      set({ swapRequests });
    } finally {
      set({ loading: false });
    }
  },

  addSwapRequest: async (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>, token: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/swaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
      if (!res.ok) throw new Error('Failed to create swap request');
      const newRequest = await res.json();
      set({ swapRequests: [...get().swapRequests, newRequest] });
    } finally {
      set({ loading: false });
    }
  },

  updateSwapRequest: async (id: string, updates: Partial<SwapRequest>, token: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/swaps/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update swap request');
      const updatedRequest = await res.json();
      set({
        swapRequests: get().swapRequests.map(req => req.id === id ? updatedRequest : req)
      });
    } finally {
      set({ loading: false });
    }
  }
}));