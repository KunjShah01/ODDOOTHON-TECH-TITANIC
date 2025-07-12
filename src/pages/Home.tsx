import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { User } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { ProfileCompletionBanner } from '../components/ProfileCompletionBanner';
import { SwapRequestModal } from '../components/SwapRequestModal';
import toast from 'react-hot-toast';

export const Home: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const {
    users,
    loading,
    availabilityFilter,
    setSearchQuery,
    setAvailabilityFilter,
    fetchUsers,
    searchQuery
  } = useAppStore();
  // Fetch users from backend on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const itemsPerPage = 6;

  // Filter users based on search and availability
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesAvailability = !availabilityFilter || user.availability === availabilityFilter;
      return matchesSearch && matchesAvailability && user.isPublic;
    });
  }, [users, searchQuery, availabilityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleRequestClick = (user: User) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleViewProfile = (user: User) => {
    // For now, just show a toast. In a real app, this would navigate to profile detail
    toast.success(`Viewing ${user.name}'s profile`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const availabilityOptions = [
    { value: '', label: 'All Availability' },
    { value: 'evenings', label: 'Evenings' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'flexible', label: 'Flexible' },
    { value: 'mornings', label: 'Mornings' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!isAuthenticated ? (
        // Professional Landing Page for Non-Authenticated Users
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
            Unlock Your Potential Through 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Skill Exchange</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 transition-colors duration-300">
            Connect with a thriving community of professionals eager to share and learn. 
            Swap your expertise, acquire new abilities, and accelerate your personal and career growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-300">
              <div className="text-blue-600 dark:text-blue-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Learn New Skills</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Expand your knowledge base by learning directly from experienced professionals.</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-300">
              <div className="text-purple-600 dark:text-purple-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Network Effectively</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Build meaningful connections with peers and mentors in your field and beyond.</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-300">
              <div className="text-green-600 dark:text-green-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Accelerate Career Growth</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Gain practical experience and insights that can propel your career forward.</p>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/login'}
            className="mt-12 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
          >
            Get Started - Sign In or Sign Up
          </button>
        </div>
      ) : (
        // Content for Authenticated Users
        <>
          {/* Profile Completion Banner */}
          <ProfileCompletionBanner />

          {/* Hero Section (Optional for authenticated, or a different greeting) */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
          Find Your Next 
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Skill Swap</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
          Connect with talented professionals and exchange skills to grow together
        </p>
      </div>
          {/* Search and Filters */}
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or skills..."
                  value={searchQuery} // Assuming searchQuery is declared or available in this scope
                  onChange={(e) => setSearchQuery(e.target.value)} // Assuming setSearchQuery is available
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>

              {/* Availability Filter */}
              <div className="md:w-64 relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  {availabilityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {filteredUsers.length === 0 ? (
                'No profiles found'
              ) : (
                `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredUsers.length)} of ${filteredUsers.length} profiles`
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              {/* <LoadingSpinner size="lg" /> */} {/* Assuming LoadingSpinner exists and is imported */}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">No profiles found</h3>
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Profile Grid */}
          {!loading && paginatedUsers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedUsers.map((user) => (
                <ProfileCard
                  key={user.id}
                  user={user}
                  onRequestClick={handleRequestClick}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Swap Request Modal */}
          <SwapRequestModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            targetUser={selectedUser}
          />
        </>
      )}

      {/* Login Modal for Non-authenticated Users (kept outside conditional rendering as it's triggered by user action) */}
      {showLoginModal && ( // Assuming showLoginModal is state managed
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Sign In Required</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
              Please sign in to send skill swap requests and connect with other professionals.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  window.location.href = '/login';
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




