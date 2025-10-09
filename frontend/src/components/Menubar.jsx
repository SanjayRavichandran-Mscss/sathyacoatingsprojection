import { Link, useLocation, useNavigate } from 'react-router-dom';
import { topMenus } from '../utils/menuData';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User, X } from 'lucide-react';
import axios from 'axios';

const Menubar = ({ onMobileMenuToggle }) => {
  const location = useLocation();
  const profileRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user')) || {};
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('encodedUserId');
      localStorage.removeItem('loginTime');
      sessionStorage.removeItem('user');
      toast.success('Logged out successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="flex items-center justify-between bg-[#FAF9F6] text-[#1e7a6f] px-4 sm:px-24 shadow-md z-10 relative">
      <div className="flex items-center gap-2">
        <button
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-emerald-50"
          onClick={onMobileMenuToggle}
          aria-label="Open menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src="/logo_abstract.png" alt="Logo" className="w-[75px] p-1" />
      </div>

      <ul className="hidden md:flex items-center space-x-6">
        {topMenus
          .filter((m) => m.id !== 99)
          .map((item) => {
            const ActiveIcon = item.icon;
            const active =
              location.pathname === item.path ||
              (location.pathname.startsWith(item.activePath) && item.activePath !== '/');
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center hover:text-blue-500 transition-colors font-medium ${
                    active ?  'text-blue-600' : ''
                  }`}
                >
                  <ActiveIcon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              </li>
            );
          })}
      </ul>

      <div className="relative flex items-center">
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-[#1e7a6f] text-white flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="User Profile"
          >
            <User size={20} />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-50 animate-slide-in-down">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none"
                  aria-label="Close Profile"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600 capitalize">Name: {user.user_name}</p>
              <p className="text-sm text-gray-600">Email: {user.user_email}</p>
              <button
                onClick={handleLogout}
                className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menubar;