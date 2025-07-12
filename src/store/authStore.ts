import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';

// Mock API functions
const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@example.com' && password === 'password') {
    return {
      user: {
        id: '1',
        name: 'Alex Johnson',
        email: 'demo@example.com',
        location: 'San Francisco, CA',
        profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        skillsOffered: ['React', 'TypeScript', 'Node.js'],
        skillsWanted: ['Python', 'Machine Learning', 'AWS'],
        availability: 'evenings',
        isPublic: true,
        averageRating: 4.8,
        reviewCount: 24
      },
      token: 'mock-jwt-token-123'
    };
  }
  
  // Simulate a new user login
  if (email === 'newuser@example.com' && password === 'password') {
    return {
      user: {
        id: '999',
        name: 'New User',
        email: 'newuser@example.com',
        location: '',
        profilePhoto: '',
        skillsOffered: [],
        skillsWanted: [],
        availability: '',
        isPublic: true,
        averageRating: 0,
        reviewCount: 0
      },
      token: 'mock-jwt-token-new-user'
    };
  }
  
  throw new Error('Invalid credentials');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        const { user, token } = await mockLogin(email, password);
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);