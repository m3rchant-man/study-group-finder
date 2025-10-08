import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserMeetings } from '../services/meetingService';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [myMeetings, setMyMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const meetings = await getUserMeetings(currentUser.uid);
      setMyMeetings(meetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser.uid]);

  useEffect(() => {
    loadMyMeetings();
  }, [loadMyMeetings]);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">My Study Meetings</h2>
        <p className="text-gray-600">Meetings you've created or joined</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading your meetings...</p>
        </div>
      ) : myMeetings.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first study meeting or join an existing one!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myMeetings.map((meeting) => (
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
                </div>
              </div>

              {meeting.description && (
                <p className="text-sm text-gray-600 mb-4">{meeting.description}</p>
              )}

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {meeting.createdBy?.id === currentUser.uid ? 'You created this' : 'You joined this'}
                </div>
                
                <div className="text-xs text-gray-500">
                  Status: {meeting.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
