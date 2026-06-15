import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Send, Camera } from 'lucide-react';
import BrandLogo from './BrandLogo';
import HighlightedSoldyHome from './HighlightedSoldyHome';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16 ios-safe-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <BrandLogo theme="dark" homeClassName="text-amber-700" />
            </Link>
            <p className="text-sm leading-relaxed">
              Timeless furniture, crafted comfort, and modern interiors for every Kenyan home.
            </p>
            <div className="flex gap-3">
              {[Globe, Send, Camera].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('common.shopNow', 'Shop')}</h4>
            <ul className="space-y-2 text-sm">
              {['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items', 'Brands'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('common.profile', 'Account')}</h4>
            <ul className="space-y-2 text-sm">
              {[[t('common.profile', 'My Profile'), '/profile'], [t('common.myOrders', 'My Orders'), '/orders'], [t('common.wishlist', 'Wishlist'), '/wishlist'], [t('common.cart', 'Cart'), '/cart']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-primary-500" />
                Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-primary-500" />
                +254 798406723
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-primary-500" />
                <a
                  href="https://mail.google.com/mail/u/0/#inbox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  kisimoniaubain@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 mt-10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>
            © 2026 <HighlightedSoldyHome text="SoldyHome" homeClassName="text-amber-700" />. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
