import React, { useState, useEffect } from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu } from 'react-icons/fi';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import useLocalStorage from '@/hooks/useLocalStorage';
import Sidebar from '@/dashboard/components/Sidebar';
import ErrorPage from '@/components/layout/ErrorPage';
import { logout } from '@/store/slices/authSlice';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [token, setToken] = useLocalStorage('token', null);
  const pathname = location.pathname;

  const { role, isAuthenticated } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (token && isAuthenticated !== undefined && role !== undefined) {
    if (role === 'Admin' && pathname === '/dashboard/users/') {
      return <ErrorPage statusCode={403} message="Access Denied" />;
    }
  }

  if (!token || isAuthenticated === undefined || role === undefined) {
    return null;
  }

  const handleLogout = () => {
    setToken(null);
    navigate('/');
    dispatch(logout());
  };

  const getCurrentPageTitle = () => {
    const routes = {
      '/dashboard': t('dashboard.menu.overview'),
      '/dashboard/properties': t('dashboard.menu.properties'),
      '/dashboard/property-types': t('dashboard.menu.propertyTypes'),
      '/dashboard/transaction-types': t('dashboard.menu.transactionTypes'),
      '/dashboard/property-statuses': t('dashboard.menu.propertyStatuses'),
      '/dashboard/finishing-levels': t('dashboard.menu.finishingLevels'),
      '/dashboard/furnishing-statuses': t('dashboard.menu.furnishingStatuses'),
      '/dashboard/tickets': t('dashboard.menu.tickets'),
      '/dashboard/social-links': t('dashboard.menu.socialLinks'),
      '/dashboard/sliders': t('dashboard.menu.sliders'),
      '/dashboard/slider-images': t('dashboard.menu.sliderImages'),
      '/dashboard/testimonials': t('dashboard.menu.testimonials'),
      '/dashboard/profile': t('dashboard.layout.profile'),
    };
    return routes[pathname] || t('dashboard.layout.dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="lg:ms-64">
        <header className="sticky top-0 z-30 h-20 bg-neutral-50/80 backdrop-blur-xl border-b border-neutral-400">
          <div className="h-full flex items-center justify-between px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-third-900 hover:bg-neutral-100 p-2 rounded-lg transition-colors"
              aria-label={t('dashboard.layout.openMenu')}
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-third-900 font-serif">
                {getCurrentPageTitle()}
              </h1>
            </div>
            <div className="lg:hidden flex-1 mx-4">
              <h1 className="text-lg font-bold text-third-900 font-serif truncate">
                {getCurrentPageTitle()}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
