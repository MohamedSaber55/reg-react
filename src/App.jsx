import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Toaster } from 'react-hot-toast';
import '@/utils/i18n';
import { LanguageLoadingProvider } from '@/components/common/LanguageLoadingOverlay';
import { useTranslation } from 'react-i18next';
import TrackingPixels from '@/components/TrackingPixels';
import MetaPixelTracker from '@/components/tracking/MetaPixelTracker';

// Layouts
import Loading from '@/components/layout/Loading';
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Main pages
import HomePage from '@/pages/main/HomePage';
const AboutPage = lazy(() => import('@/pages/main/AboutPage'));
const ContactPage = lazy(() => import('@/pages/main/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/main/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/main/TermsPage'));
const TestimonialsPage = lazy(() => import('@/pages/main/TestimonialsPage'));
const RateUsPage = lazy(() => import('@/pages/main/RateUsPage'));
const ProjectsPage = lazy(() => import('@/pages/main/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/pages/main/ProjectDetailPage'));
const StageDetailPage = lazy(() => import('@/pages/main/StageDetailPage'));
const UnitDetailPage = lazy(() => import('@/pages/main/UnitDetailPage'));
const PropertiesPage = lazy(() => import('@/pages/main/PropertiesPage'));
const PropertyDetailPage = lazy(() => import('@/pages/main/PropertyDetailPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const VerifyOtpPage = lazy(() => import('@/pages/auth/VerifyOtpPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Dashboard pages
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const DashboardPropertiesPage = lazy(() => import('@/pages/dashboard/PropertiesPage'));
const CreatePropertyPage = lazy(() => import('@/pages/dashboard/properties/CreatePropertyPage'));
const EditPropertyPage = lazy(() => import('@/pages/dashboard/properties/EditPropertyPage'));
const PropertyTypesPage = lazy(() => import('@/pages/dashboard/PropertyTypesPage'));
const TransactionTypesPage = lazy(() => import('@/pages/dashboard/TransactionTypesPage'));
const PropertyStatusesPage = lazy(() => import('@/pages/dashboard/PropertyStatusesPage'));
const FinishingLevelsPage = lazy(() => import('@/pages/dashboard/FinishingLevelsPage'));
const FurnishingStatusesPage = lazy(() => import('@/pages/dashboard/FurnishingStatusesPage'));
const TicketsPage = lazy(() => import('@/pages/dashboard/TicketsPage'));
const SocialLinksPage = lazy(() => import('@/pages/dashboard/SocialLinksPage'));
const SlidersPage = lazy(() => import('@/pages/dashboard/SlidersPage'));
const SliderImagesPage = lazy(() => import('@/pages/dashboard/SliderImagesPage'));
const TestimonialsAdminPage = lazy(() => import('@/pages/dashboard/TestimonialsPage'));
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'));
const UsersPage = lazy(() => import('@/pages/dashboard/UsersPage'));
const UserProfilePage = lazy(() => import('@/pages/dashboard/UserProfilePage'));
const AboutSectionsPage = lazy(() => import('@/pages/dashboard/AboutSectionsPage'));
const AboutValuesPage = lazy(() => import('@/pages/dashboard/AboutValuesPage'));
const AddressesPage = lazy(() => import('@/pages/dashboard/AddressesPage'));
const BusinessHoursPage = lazy(() => import('@/pages/dashboard/BusinessHoursPage'));
const ContactEmailsPage = lazy(() => import('@/pages/dashboard/ContactEmailsPage'));
const ContactPhonesPage = lazy(() => import('@/pages/dashboard/ContactPhonesPage'));
const ContactPageAdminPage = lazy(() => import('@/pages/dashboard/ContactPagePage'));
const FaqsPage = lazy(() => import('@/pages/dashboard/FaqsPage'));
const HeroSectionsPage = lazy(() => import('@/pages/dashboard/HeroSectionsPage'));
const MapSectionsPage = lazy(() => import('@/pages/dashboard/MapSectionsPage'));
const ProjectStagesPage = lazy(() => import('@/pages/dashboard/ProjectStagesPage'));
const DashboardProjectsPage = lazy(() => import('@/pages/dashboard/ProjectsPage'));
const ServiceItemsPage = lazy(() => import('@/pages/dashboard/ServiceItemsPage'));
const ServiceSectionsPage = lazy(() => import('@/pages/dashboard/ServiceSectionsPage'));
const TrackingPage = lazy(() => import('@/pages/dashboard/TrackingPage'));
const UnitModelImagesPage = lazy(() => import('@/pages/dashboard/UnitModelImagesPage'));
const UnitModelsPage = lazy(() => import('@/pages/dashboard/UnitModelsPage'));

// Scroll to top on route change, or to the anchor when the URL carries a hash.
// Without the hash branch, links like /about-us#services land at the top of the
// page and look broken.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // The target may not be mounted yet on a fresh navigation (data still
      // loading), so retry on the next frame before giving up.
      const scrollToAnchor = () => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };

      if (scrollToAnchor()) return;

      const frame = requestAnimationFrame(() => {
        if (!scrollToAnchor()) window.scrollTo(0, 0);
      });
      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      {/* Injects the Meta Pixel / GA tags configured in Dashboard → Tracking */}
      <TrackingPixels />
      <LanguageLoadingProvider>
        <BrowserRouter>
          <ScrollToTop />
          {/* Named page events + global click tracking — see MetaPixelTracker */}
          <MetaPixelTracker />
          <Toaster position="top-right" />
          {/* Route chunks are code-split; this boundary covers their load */}
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <Loading />
              </div>
            }
          >
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
          </Suspense>
        </BrowserRouter>
      </LanguageLoadingProvider>
    </Provider>
  );
}
