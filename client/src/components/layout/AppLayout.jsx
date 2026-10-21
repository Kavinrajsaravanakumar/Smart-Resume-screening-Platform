import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      <Sidebar />
      <div className="ml-[256px] transition-all duration-300">
        <Navbar />
        <main className="p-6 max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
