import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Connect with Your Classmates
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Find study groups for your classes or create your own. 
          Meet in person with students who share your academic goals.
        </p>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/create')}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Study Meeting
          </button>
          <button
            onClick={() => navigate('/find')}
            className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Search className="w-5 h-5 mr-2" />
            Find Study Groups
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="bg-indigo-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Plus className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Meetings</h3>
          <p className="text-gray-600">
            Set up study groups for your classes with specific times, locations, and participant limits.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-indigo-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Groups</h3>
          <p className="text-gray-600">
            Search for existing study groups by course ID or browse all available meetings.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-indigo-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Connected</h3>
          <p className="text-gray-600">
            Get email notifications when you join meetings and track all your study groups.
          </p>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">For Students Looking to Study</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Search for your course ID (e.g., MATH101, CS201)</li>
              <li>Browse available study meetings</li>
              <li>Join meetings that fit your schedule</li>
              <li>Meet in person at the specified location</li>
            </ol>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">For Students Creating Groups</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Create a meeting with course details</li>
              <li>Set meeting time and campus location</li>
              <li>Specify minimum and maximum participants</li>
              <li>Wait for classmates to join your group</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
