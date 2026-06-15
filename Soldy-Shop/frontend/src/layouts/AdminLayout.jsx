import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import BrandLogo from '../components/BrandLogo';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Tag, LogOut, ChevronRight, Home, UserCircle, Settings, ChevronDown,
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const initial = user?.name?.[0]?.toUpperCase() || 'K';
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <NavLink to="/" className="flex items-center gap-2">
            <BrandLogo theme="dark" compact homeClassName="text-amber-700" />
          </NavLink>
          <span className="text-xs text-gray-500 mt-1 block">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Home size={18} />
            Home
            <ChevronRight size={14} className="ml-auto opacity-50" />
          </NavLink>

          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
              <ChevronRight size={14} className="ml-auto opacity-50" />
            </NavLink>
          ))}

          <div className="mt-4 border-t border-gray-800 pt-4">
            <button
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                {initial}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || 'Kisimoni Aubain'}
                  <span className="ml-1 text-primary-400 lowercase">{user?.role || 'admin'}</span>
                </p>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileMenuOpen && (
              <div className="mt-2 space-y-1 border border-gray-800 bg-gray-900/80 rounded-xl p-2">
                <NavLink to="/profile" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-all">
                  <UserCircle size={16} /> Profile
                </NavLink>
                <NavLink to="/orders" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-all">
                  <ShoppingCart size={16} /> My Orders
                </NavLink>
                <NavLink to="/settings" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-all">
                  <Settings size={16} /> Settings
                </NavLink>
                <NavLink to="/admin" end onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-primary-400 hover:text-primary-300 hover:bg-gray-800 transition-all">
                  <LayoutDashboard size={16} /> Admin Panel
                </NavLink>
                <hr className="border-gray-800 my-1" />
                <button
                  onClick={() => { dispatch(logout()); setProfileMenuOpen(false); navigate('/login', { replace: true }); }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 w-full transition-all"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => { navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 w-full transition-all"
          >
            <Home size={18} />
            Back to Home
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-950 text-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
