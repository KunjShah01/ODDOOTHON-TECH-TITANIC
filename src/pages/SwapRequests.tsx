import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Clock, CheckCircle, XCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { SkillTag } from '../components/SkillTag';
import toast from 'react-hot-toast';

export const SwapRequests: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { swapRequests, updateSwapRequest, fetchSwapRequests } = useAppStore();
  const { user, token } = useAuthStore();
  // Fetch swap requests from backend on mount
  useEffect(() => {
    if (token) {
      fetchSwapRequests(token);
    }
  }, [fetchSwapRequests, token]);

  const itemsPerPage = 6;

  // Filter requests
  const filteredRequests = useMemo(() => {
    return swapRequests.filter(request => {
      // Show requests where user is either sender or receiver
      const isUserInvolved = request.fromUserId === user?.id || request.toUserId === user?.id;
      const matchesStatus = !statusFilter || request.status === statusFilter;
      
      return isUserInvolved && matchesStatus;
    });
  }, [swapRequests, user?.id, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const handleAccept = async (requestId: string) => {
    try {
      if (!token) throw new Error('Not authenticated');
      await updateSwapRequest(requestId, {
        status: 'accepted',
        updatedAt: new Date().toISOString()
      }, token);
      toast.success('Swap request accepted!');
    } catch {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      if (!token) throw new Error('Not authenticated');
      await updateSwapRequest(requestId, {
        status: 'rejected',
        updatedAt: new Date().toISOString()
      }, token);
      toast.success('Swap request rejected');
    } catch {
      toast.error('Failed to reject request');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      accepted: 'text-green-600 bg-green-50 border-green-200',
      rejected: 'text-red-600 bg-red-50 border-red-200',
      completed: 'text-blue-600 bg-blue-50 border-blue-200'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusOptions = [
    { value: '', label: 'All Requests' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Swap Requests</h1>
        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Manage your incoming and outgoing skill exchange requests</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {filteredRequests.length === 0 ? (
              'No requests found'
            ) : (
              `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredRequests.length)} of ${filteredRequests.length} requests`
            )}
          </div>
        </div>
      </div>

      {/* No Requests */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">No swap requests</h3>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            {statusFilter 
              ? 'Try adjusting your filter to see more requests'
              : 'Start browsing profiles to send your first skill swap request!'
            }
          </p>
        </div>
      )}

      {/* Requests Grid */}
      {paginatedRequests.length > 0 && (
        <div className="space-y-6 mb-8">
          {paginatedRequests.map((request) => {
            const isIncoming = request.toUserId === user?.id;
            const otherUser = isIncoming ? request.fromUser : request.toUser;
            
            return (
              <div key={request.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {isIncoming ? 'Incoming Request' : 'Outgoing Request'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(request.createdAt)}
                    </div>
                  </div>

                  {/* User Info & Skills */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Other User */}
                    <div className="flex items-center space-x-4">
                      {otherUser.profilePhoto ? (
                        <img
                          src={otherUser.profilePhoto}
                          alt={otherUser.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {otherUser.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{otherUser.name}</h3>
                        {otherUser.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{otherUser.location}</p>
                        )}
                      </div>
                    </div>

                    {/* Skills Exchange */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">
                            {isIncoming ? 'They offer' : 'You offer'}
                          </p>
                          <SkillTag 
                            skill={isIncoming ? request.wantedSkill : request.offeredSkill} 
                            variant="offered" 
                          />
                        </div>
                        
                        <ArrowRight className="w-5 h-5 text-gray-400 rotate-90 sm:rotate-0" />
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">
                            {isIncoming ? 'You teach' : 'They teach'}
                          </p>
                          <SkillTag 
                            skill={isIncoming ? request.offeredSkill : request.wantedSkill} 
                            variant="wanted" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {request.message && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic transition-colors duration-300">"{request.message}"</p>
                    </div>
                  )}

                  {/* Actions */}
                  {isIncoming && request.status === 'pending' && (
                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl transition-colors duration-300">
                      <p className="text-green-800 dark:text-green-300 text-sm font-medium transition-colors duration-300">
                        🎉 Great! You can now connect with {otherUser.name} to start your skill exchange.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
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
                onClick={() => setCurrentPage(page)}
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
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};