import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

/**
 * Main layout component for the application.
 *
 * This component renders the header and a main content area for nested routes.
 * @returns {JSX.Element} The layout structure of the application.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
