import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Toaster } from 'react-hot-toast';
import '@/utils/i18n';
import { LanguageLoadingProvider } from '@/components/common/LanguageLoadingOverlay';
import { useTranslation } from 'react-i18next';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Main pages
import HomePage from '@/pages/main/HomePage';
import AboutPage from '@/pages/main/AboutPage';
import ContactPage from '@/pages/main/ContactPage';
import PrivacyPage from '@/pages/main/PrivacyPage';
import TermsPage from '@/pages/main/TermsPage';
import TestimonialsPage from '@/pages/main/TestimonialsPage';
import RateUsPage from '@/pages/main/RateUsPage';
import ProjectsPage from '@/pages/main/ProjectsPage';
import ProjectDetailPage from '@/pages/main/ProjectDetailPage';
import StageDetailPage from '@/pages/main/StageDetailPage';
import UnitDetailPage from '@/pages/main/UnitDetailPage';
import PropertiesPage from '@/pages/main/PropertiesPage';
import PropertyDetailPage from '@/pages/main/PropertyDetailPage';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import VerifyOtpPage from '@/pages/auth/VerifyOtpPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

// Dashboard pages
import DashboardPage from '@/pages/dashboard/DashboardPage';
import DashboardPropertiesPage from '@/pages/dashboard/PropertiesPage';
import CreatePropertyPage from '@/pages/dashboard/properties/CreatePropertyPage';
import EditPropertyPage from '@/pages/dashboard/properties/EditPropertyPage';
import PropertyTypesPage from '@/pages/dashboard/PropertyTypesPage';
import TransactionTypesPage from '@/pages/dashboard/TransactionTypesPage';
import PropertyStatusesPage from '@/pages/dashboard/PropertyStatusesPage';
import FinishingLevelsPage from '@/pages/dashboard/FinishingLevelsPage';
import FurnishingStatusesPage from '@/pages/dashboard/FurnishingStatusesPage';
import TicketsPage from '@/pages/dashboard/TicketsPage';
import SocialLinksPage from '@/pages/dashboard/SocialLinksPage';
import SlidersPage from '@/pages/dashboard/SlidersPage';
import SliderImagesPage from '@/pages/dashboard/SliderImagesPage';
import TestimonialsAdminPage from '@/pages/dashboard/TestimonialsPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import UsersPage from '@/pages/dashboard/UsersPage';
import UserProfilePage from '@/pages/dashboard/UserProfilePage';
import AboutSectionsPage from '@/pages/dashboard/AboutSectionsPage';
import AboutValuesPage from '@/pages/dashboard/AboutValuesPage';
import AddressesPage from '@/pages/dashboard/AddressesPage';
import BusinessHoursPage from '@/pages/dashboard/BusinessHoursPage';
import ContactEmailsPage from '@/pages/dashboard/ContactEmailsPage';
import ContactPhonesPage from '@/pages/dashboard/ContactPhonesPage';
import ContactPageAdminPage from '@/pages/dashboard/ContactPagePage';
import FaqsPage from '@/pages/dashboard/FaqsPage';
import HeroSectionsPage from '@/pages/dashboard/HeroSectionsPage';
import MapSectionsPage from '@/pages/dashboard/MapSectionsPage';
import ProjectStagesPage from '@/pages/dashboard/ProjectStagesPage';
import DashboardProjectsPage from '@/pages/dashboard/ProjectsPage';
import ServiceItemsPage from '@/pages/dashboard/ServiceItemsPage';
import ServiceSectionsPage from '@/pages/dashboard/ServiceSectionsPage';
import TrackingPage from '@/pages/dashboard/TrackingPage';
import UnitModelImagesPage from '@/pages/dashboard/UnitModelImagesPage';
import UnitModelsPage from '@/pages/dashboard/UnitModelsPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <LanguageLoadingProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-right" />
          <Routes>
            {/* Main / public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/contact-us" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/rate-us" element={<RateUsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/projects/:id/stages/:stageId" element={<StageDetailPage />} />
              <Route path="/projects/:id/stages/:stageId/units/:unitId" element={<UnitDetailPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
            </Route>

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="properties" element={<DashboardPropertiesPage />} />
              <Route path="properties/create" element={<CreatePropertyPage />} />
              <Route path="properties/edit/:id" element={<EditPropertyPage />} />
              <Route path="property-types" element={<PropertyTypesPage />} />
              <Route path="transaction-types" element={<TransactionTypesPage />} />
              <Route path="property-statuses" element={<PropertyStatusesPage />} />
              <Route path="finishing-levels" element={<FinishingLevelsPage />} />
              <Route path="furnishing-statuses" element={<FurnishingStatusesPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="social-links" element={<SocialLinksPage />} />
              <Route path="sliders" element={<SlidersPage />} />
              <Route path="slider-images" element={<SliderImagesPage />} />
              <Route path="testimonials" element={<TestimonialsAdminPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/profile" element={<UserProfilePage />} />
              <Route path="about-sections" element={<AboutSectionsPage />} />
              <Route path="about-values" element={<AboutValuesPage />} />
              <Route path="addresses" element={<AddressesPage />} />
              <Route path="business-hours" element={<BusinessHoursPage />} />
              <Route path="contact-emails" element={<ContactEmailsPage />} />
              <Route path="contact-phones" element={<ContactPhonesPage />} />
              <Route path="contact-page" element={<ContactPageAdminPage />} />
              <Route path="faqs" element={<FaqsPage />} />
              <Route path="hero-sections" element={<HeroSectionsPage />} />
              <Route path="map-sections" element={<MapSectionsPage />} />
              <Route path="project-stages" element={<ProjectStagesPage />} />
              <Route path="projects" element={<DashboardProjectsPage />} />
              <Route path="service-items" element={<ServiceItemsPage />} />
              <Route path="service-sections" element={<ServiceSectionsPage />} />
              <Route path="tracking" element={<TrackingPage />} />
              <Route path="unit-model-images" element={<UnitModelImagesPage />} />
              <Route path="unit-models" element={<UnitModelsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageLoadingProvider>
    </Provider>
  );
}
