import { create } from 'zustand';
import { AppState, User, SwapRequest } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skillsOffered: ['Python', 'Data Science', 'Machine Learning'],
    skillsWanted: ['React', 'Frontend Development'],
    availability: 'weekends',
    isPublic: true,
    averageRating: 4.9,
    reviewCount: 31
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    email: 'marcus@example.com',
    location: 'Austin, TX',
    profilePhoto: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skillsOffered: ['AWS', 'DevOps', 'Docker'],
    skillsWanted: ['Mobile Development', 'Swift'],
    availability: 'evenings',
    isPublic: true,
    averageRating: 4.6,
    reviewCount: 18
  },
  {
    id: '4',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    location: 'Seattle, WA',
    profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
    skillsWanted: ['Vue.js', 'Nuxt.js'],
    availability: 'flexible',
    isPublic: true,
    averageRating: 4.7,
    reviewCount: 22
  },
  {
    id: '5',
    name: 'David Park',
    email: 'david@example.com',
    location: 'Los Angeles, CA',
    profilePhoto: 'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skillsOffered: ['Mobile Development', 'Flutter', 'iOS'],
    skillsWanted: ['Backend Development', 'PostgreSQL'],
    availability: 'weekends',
    isPublic: true,
    averageRating: 4.5,
    reviewCount: 15
  }
];

const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    fromUser: {
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
    toUser: mockUsers[0],
    offeredSkill: 'React',
    wantedSkill: 'Python',
    message: 'Hi Sarah! I\'d love to learn Python from you while sharing my React knowledge.',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  users: mockUsers,
  swapRequests: mockSwapRequests,
  loading: false,
  searchQuery: '',
  availabilityFilter: '',
  
  setUsers: (users: User[]) => set({ users }),
  setSwapRequests: (requests: SwapRequest[]) => set({ swapRequests: requests }),
  setLoading: (loading: boolean) => set({ loading }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setAvailabilityFilter: (filter: string) => set({ availabilityFilter: filter }),
  
  addSwapRequest: (request: SwapRequest) => {
    const currentRequests = get().swapRequests;
    set({ swapRequests: [...currentRequests, request] });
  },
  
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => {
    const currentRequests = get().swapRequests;
    const updatedRequests = currentRequests.map(req => 
      req.id === id ? { ...req, ...updates } : req
    );
    set({ swapRequests: updatedRequests });
  }
}));