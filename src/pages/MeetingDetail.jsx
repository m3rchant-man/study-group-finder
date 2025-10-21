import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Calendar, MapPin, Users, ArrowLeft, UserMinus, Trash2, Mail, Check } from 'lucide-react';
import { format } from 'date-fns';

export default function MeetingDetail() {
  const { meetingId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState('');

  const loadMeeting = useCallback(async () => {
    try {
      setLoading(true);
      const meetingRef = doc(db, 'meetings', meetingId);
      const meetingDoc = await getDoc(meetingRef);
      
      if (!meetingDoc.exists()) {
        setError('Meeting not found');
        return;
      }
      
      const meetingData = {
        id: meetingDoc.id,
        ...meetingDoc.data()
      };
      
      setMeeting(meetingData);
    } catch (error) {
      console.error('Error loading meeting:', error);
      setError('Failed to load meeting');
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    loadMeeting();
  }, [loadMeeting]);

  const handleLeaveMeeting = async () => {
    if (!meeting || !currentUser) return;

    if (isUserCreator()) {
      setError("You cannot leave a meeting you've created. Please delete the meeting instead.");
      return;
    }
    
    try {
      setLeaving(true);
      setError('');
      
      const meetingRef = doc(db, 'meetings', meetingId);
      
      // Remove user from participants
      const updatedParticipants = meeting.participants.filter(p => p.id !== currentUser.uid);
      
      // If less than 1 person remaining, delete the meeting
      if (updatedParticipants.length < 1) {
        await deleteDoc(meetingRef);
        toast.success('You left the meeting. Since you were the last participant, the meeting has been deleted.');
        navigate('/dashboard');
        return;
      }
      
      // Update participants
      await updateDoc(meetingRef, {
        participants: updatedParticipants
      });
      
      // Reload meeting data
      await loadMeeting();
      
      toast.success('Successfully left the meeting!');
    } catch (error) {
      console.error('Error leaving meeting:', error);
      setError('Failed to leave meeting');
    } finally {
      setLeaving(false);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!meeting || !currentUser) return;
    
    if (meeting.createdBy.id !== currentUser.uid) {
      setError('Only the meeting creator can delete the meeting');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLeaving(true);
      setError('');
      
      const meetingRef = doc(db, 'meetings', meetingId);
      await deleteDoc(meetingRef);
      
      toast.success('Meeting deleted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setError('Failed to delete meeting');
    } finally {
      setLeaving(false);
    }
  };

  const isUserInMeeting = () => {
    return meeting?.participants?.some(p => p.id === currentUser.uid);
  };

  const isUserCreator = () => {
    return meeting?.createdBy?.id === currentUser.uid;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Meeting Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This meeting does not exist.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">Meeting Details</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Meeting Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {meeting.courseId.toUpperCase()}
            </h2>
            {meeting.courseName && (
              <p className="text-lg text-gray-600">{meeting.courseName}</p>
            )}
          </div>

          {/* Meeting Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Meeting Time</p>
                  <p>{format(meeting.meetingTime?.toDate ? meeting.meetingTime.toDate() : new Date(meeting.meetingTime), 'EEEE, MMMM dd, yyyy • h:mm a')}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Location</p>
                  <p>{meeting.location}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Participants</p>
                  <p>{meeting.participants?.length || 0} / {meeting.maxParticipants} people</p>
                  <p className="text-sm text-gray-500">Minimum: {meeting.minParticipants}</p>
                </div>
              </div>
            </div>

            <div>
              {meeting.description && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{meeting.description}</p>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                <p>Created by: {meeting.createdBy?.name || 'Unknown'}</p>
                <p>Status: {meeting.status}</p>
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Participants ({meeting.participants?.length || 0})
            </h3>
            
            {meeting.participants?.length === 0 ? (
              <p className="text-gray-500 italic">No participants yet</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {meeting.participants?.map((participant, index) => (
                  <div key={participant.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-indigo-600">
                          {participant.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{participant.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                        {participant.id === meeting.createdBy?.id && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Creator</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
          )}

          <div className="flex justify-between items-center">
            <div>
              {isUserInMeeting() && (
                  <span className="flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                    <Check className="w-4 h-4 mr-2" />
                    Joined
                  </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              {isUserCreator() && (
                <button
                  onClick={handleDeleteMeeting}
                  disabled={leaving}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {leaving ? 'Deleting...' : 'Delete Meeting'}
                </button>
              )}
              
              {isUserInMeeting() && !isUserCreator() && (
                <button
                  onClick={handleLeaveMeeting}
                  disabled={leaving}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  <UserMinus className="w-4 h-4 mr-2" />
                  {leaving ? 'Leaving...' : 'Leave Meeting'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
