import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllMeetings, searchMeetingsByCourse, joinMeeting } from '../../services/meetingService';
import { Calendar, MapPin, Users, Search, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

/**
 * Component for finding and joining study meetings.
 *
 * This component allows users to search for meetings by course ID,
 * view a list of all available meetings, and join a meeting.
 */
export default function FindMeeting() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joiningMeeting, setJoiningMeeting] = useState(null);

  useEffect(() => {
    loadAllMeetings();
  }, []);

  const loadAllMeetings = async () => {
    try {
      setLoading(true);
      const allMeetings = await getAllMeetings();
      setMeetings(allMeetings);
    } catch (error) {
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadAllMeetings();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const searchResults = await searchMeetingsByCourse(searchTerm.trim());
      setMeetings(searchResults);
    } catch (error) {
      setError('Failed to search meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async (meetingId) => {
    try {
      setJoiningMeeting(meetingId);
      setError('');
      
      await joinMeeting(
        meetingId,
        currentUser.uid,
        currentUser.email,
        currentUser.displayName || currentUser.email.split('@')[0]
      );
      
      // Reload meetings to show updated participant count
      await loadAllMeetings();
      
      // Show success message
      toast.success('Successfully joined the meeting!');
    } catch (error) {
      toast.error(error.message || 'Failed to join meeting. You may already be a participant.');
    } finally {
      setJoiningMeeting(null);
    }
  };

  const isUserInMeeting = (meeting) => {
    return meeting.participants?.some(p => p.id === currentUser.uid);
  };

  const isMeetingFull = (meeting) => {
    return meeting.participants?.length >= meeting.maxParticipants;
  };

  const canJoinMeeting = (meeting) => {
    return !isUserInMeeting(meeting) && !isMeetingFull(meeting);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Study Meetings</h2>
        <p className="text-gray-600">Search for study groups by course or browse all available meetings</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by course ID (e.g., MATH101, CS201)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={loadAllMeetings}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Show All
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
      )}

      {/* Meetings List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading meetings...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try a different search term or create a new meeting.' : 'Be the first to create a study meeting!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/meeting/${meeting.id}`)}>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {meeting.courseId.toUpperCase()}
                </h3>
                {meeting.courseName && (
                  <p className="text-sm text-gray-600">{meeting.courseName}</p>
                )}
              </div>

              <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(meeting.meetingTime?.toDate ? meeting.meetingTime.toDate() : new Date(meeting.meetingTime), 'MMM dd, yyyy • h:mm a')}
                  </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {meeting.location}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {meeting.participants?.length || 0} / {meeting.maxParticipants} participants
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                    Min: {meeting.minParticipants}
                  </span>
                </div>
              </div>

              {meeting.description && (
                <p className="text-sm text-gray-600 mb-4">{meeting.description}</p>
              )}

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Created by {meeting.createdBy?.name || 'Unknown'}
                </div>
                
                {canJoinMeeting(meeting) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinMeeting(meeting.id);
                    }}
                    disabled={joiningMeeting === meeting.id}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {joiningMeeting === meeting.id ? 'Joining...' : 'Join Meeting'}
                  </button>
                ) : isUserInMeeting(meeting) ? (
                  <span className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-md">
                    You're in this meeting
                  </span>
                ) : (
                  <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-md">
                    Meeting Full
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
