import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import BrandLogo from './BrandLogo';
import { useLanguage } from '../contexts/LanguageContext';
import {
  ShoppingCart, Heart, Search, Menu, X, User,
  Package, LogOut, LayoutDashboard, ChevronDown, Settings,
} from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const { items: wishlist } = useSelector((s) => s.wishlist);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();
  const displayName = String(user?.name || user?.fullName || 'User');
  const displayInitial = String(displayName[0] || 'U').toUpperCase();

  const cartCount = items.reduce((acc, i) => acc + i.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#111827] border-b border-gray-700 shadow-sm ios-safe-top" style={{ backgroundColor: '#111827' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <BrandLogo compact />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-white/35 bg-white/15 text-white placeholder:text-white/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60"
              />
            </div>
          </form>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {['/', '/products'].map((path, i) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive ? 'text-amber-700 font-bold' : 'text-amber-100 font-medium hover:text-white hover:bg-white/15'
                  }`
                }
              >
                {[t('common.home', 'Home'), t('common.products', 'Products')][i]}
              </NavLink>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Wishlist */}
            <Link to="/wishlist" className="hidden sm:inline-flex relative p-2 rounded-xl hover:bg-white/15 text-white/90 transition-colors">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-white/15 text-white/90 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/15 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-primary-600">{displayInitial}</span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-white max-w-[80px] truncate">{displayName}</span>
                  <ChevronDown size={14} className="text-white/70" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-[#1f2937] border border-gray-700 rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:text-amber-400 hover:bg-white/5 transition-all duration-200 rounded-lg mx-2">
                      <User size={18} className="text-amber-600" /> {t('common.profile', 'Profile')}
                    </Link>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:text-amber-400 hover:bg-white/5 transition-all duration-200 rounded-lg mx-2">
                      <Package size={18} className="text-amber-600" /> {t('common.myOrders', 'My Orders')}
                    </Link>
                    <Link to="/settings" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:text-amber-400 hover:bg-white/5 transition-all duration-200 rounded-lg mx-2">
                      <Settings size={18} className="text-amber-600" /> {t('common.settings', 'Settings')}
                    </Link>
                    {user.role === 'admin' && (
                      <>
                        <div className="my-2 border-t border-gray-600" />
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-600/20 transition-all duration-200 rounded-lg mx-2 font-semibold">
                          <LayoutDashboard size={18} className="text-amber-500" /> {t('common.adminPanel', 'Admin Panel')}
                        </Link>
                      </>
                    )}
                    <div className="my-2 border-t border-gray-600" />
                    <button
                      onClick={() => { dispatch(logout()); setUserMenuOpen(false); navigate('/login', { replace: true }); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-600/20 transition-all duration-200 rounded-lg mx-2 w-full"
                    >
                      <LogOut size={18} /> {t('common.logout', 'Logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex btn-primary text-sm py-2 px-4">{t('common.signIn', 'Sign In')}</Link>
                <Link to="/login" className="sm:hidden p-2 rounded-xl hover:bg-white/15 text-white/90 transition-colors" aria-label={t('common.signIn', 'Sign In')}>
                  <User size={20} />
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-white/15 text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/20 px-4 py-3 space-y-2 animate-slide-up bg-[#111827] ios-safe-bottom">
          <form onSubmit={handleSearch} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-white/35 bg-white/15 text-white placeholder:text-white/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60"
            />
          </form>
          <NavLink to="/" end onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-white/15">{t('common.home', 'Home')}</NavLink>
          <NavLink to="/products" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-white/15">{t('common.products', 'Products')}</NavLink>
          <NavLink to="/wishlist" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-white/15">{t('common.wishlist', 'Wishlist')}</NavLink>
          <NavLink to="/cart" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-white/15">{t('common.cart', 'Cart')}</NavLink>
          {user ? (
            <>
              <NavLink to="/orders" onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-white/15">{t('common.myOrders', 'My Orders')}</NavLink>
              <NavLink to="/profile" onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-white/15">{t('common.profile', 'Profile')}</NavLink>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-white/15">{t('common.signIn', 'Sign In')}</NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
