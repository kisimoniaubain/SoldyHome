import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col ios-safe-x">
      <Navbar />
      <main className="flex-1 page-enter pb-4 sm:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
