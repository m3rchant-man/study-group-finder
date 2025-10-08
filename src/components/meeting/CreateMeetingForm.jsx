import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createMeeting } from '../../services/meetingService';
import { Calendar, MapPin, Users, BookOpen } from 'lucide-react';

const RADIX = 10;

/**
 * A form component for creating a new study meeting.
 *
 * @param {object} props - The component props.
 * @param {Function} props.onSuccess - Callback function to execute on successful meeting creation.
 * @param {Function} props.onCancel - Callback function to execute when the form is cancelled.
 */
export default function CreateMeetingForm({ onSuccess, onCancel }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    meetingTime: '',
    location: '',
    minParticipants: 2,
    maxParticipants: 6,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.courseId || !formData.meetingTime || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.minParticipants >= formData.maxParticipants) {
      setError('Minimum participants must be less than maximum participants');
      return;
    }

    if (new Date(formData.meetingTime) <= new Date()) {
      setError('Meeting time must be in the future');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const meetingData = {
        ...formData,
        courseId: formData.courseId.toLowerCase().trim(),
        createdBy: {
          id: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || currentUser.email.split('@')[0]
        },
        meetingTime: new Date(formData.meetingTime)
      };

      const meetingId = await createMeeting(meetingData);
      console.log('Meeting created with ID:', meetingId);
      
      if (onSuccess) {
        onSuccess(meetingId);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      setError('Failed to create meeting. Please try again.');
    }
    
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, RADIX) : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Study Meeting</h2>
        <p className="text-gray-600">Set up a study group for your class</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="inline w-4 h-4 mr-1" />
              Course ID *
            </label>
            <input
              type="text"
              id="courseId"
              name="courseId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., MATH101, CS201"
              value={formData.courseId}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Calculus I, Data Structures"
              value={formData.courseName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="meetingTime" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Meeting Time *
            </label>
            <input
              type="datetime-local"
              id="meetingTime"
              name="meetingTime"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.meetingTime}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Library Room 201, Student Center"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="minParticipants" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Minimum Participants
            </label>
            <input
              type="number"
              id="minParticipants"
              name="minParticipants"
              min="2"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.minParticipants}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Participants
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              min="2"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.maxParticipants}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What topics will you be studying? Any specific requirements?"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
}
