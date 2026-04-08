import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {useNavigate} from 'react-router-dom';

// Import tracking hook
import { useComprehensivePageTracking } from '@/hooks/useMetaPixelPageView';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

// Redux actions
import { fetchHeroSections } from '@/store/slices/heroSectionSlice';
import { fetchServiceSections } from '@/store/slices/serviceSectionSlice';
import { fetchAboutSections } from '@/store/slices/aboutSectionSlice';
import { fetchSliders } from '@/store/slices/sliderSlice';
import { fetchSliderImages } from '@/store/slices/sliderImageSlice';
import { fetchProperties } from '@/store/slices/propertySlice';
import { fetchActiveTestimonials } from '@/store/slices/testimonialSlice';
import { fetchPropertyTypes } from '@/store/slices/propertyTypeSlice';
import { fetchTransactionTypes } from '@/store/slices/transactionTypeSlice';
import { fetchContactPhones } from '@/store/slices/contactPhoneSlice';

import Loading from '@/components/layout/Loading';
import { TestimonialsSection } from '@/components/common/TestimonialsSwiper';
import { HeroOption3 } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { AboutOption3 } from '@/components/home/AboutSection';
import { SearchOption3 } from '@/components/home/SearchSection';
import { SliderOption3 } from '@/components/home/HomeSlider';
import { FeaturedPropertiesSection } from '@/components/home/FeaturedProperties';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentLang = i18n.language;
  const isRTL = currentLang === 'ar';

  // Track page view, scroll depth, and time on page
  useComprehensivePageTracking('Homepage', {
    language: currentLang,
    rtl: isRTL
  });

  const [localFilters, setLocalFilters] = useState({
    search: '',
    propertyTypeId: null,
    transactionTypeId: null,
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
    pageNumber: 1,
    pageSize: 12
  });

  // Redux state
  const { heroSections, loading: heroLoading } = useAppSelector((state) => state.heroSection);
  const { serviceSections, loading: servicesLoading } = useAppSelector((state) => state.serviceSection);
  const { aboutSections, loading: aboutLoading } = useAppSelector((state) => state.aboutSection);
  const { sliders, loading: slidersLoading } = useAppSelector((state) => state.slider);
  const { sliderImages } = useAppSelector((state) => state.sliderImage);
  const { properties } = useAppSelector((state) => state.property);
  const { activeTestimonials } = useAppSelector((state) => state.testimonial);
  const { propertyTypes } = useAppSelector((state) => state.propertyType);
  const { transactionTypes } = useAppSelector((state) => state.transactionType);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchContactPhones());
    dispatch(fetchTransactionTypes({ pageSize: 100 }));
    dispatch(fetchPropertyTypes({ pageSize: 100 }));
    dispatch(fetchHeroSections({ pageSize: 1, pageNumber: 1 }));
    dispatch(fetchServiceSections({ pageSize: 1, pageNumber: 1 }));
    dispatch(fetchAboutSections({ pageSize: 1, pageNumber: 1 }));
    dispatch(fetchSliders({ pageSize: 1, pageNumber: 1 }));
    dispatch(fetchProperties({ pageSize: 12, pageNumber: 1, isFeatured: true }));
    dispatch(fetchActiveTestimonials({ pageSize: 10, pageNumber: 1 }));
  }, [dispatch]);

  // Fetch slider images when slider is available
  useEffect(() => {
    if (sliders && sliders.length > 0 && sliders[0].isActive) {
      const slider = sliders[0];
      dispatch(fetchSliderImages({ sliderId: slider.id, params: { pageSize: 10 } }));
    }
  }, [sliders, dispatch]);

  // Get data
  const heroSection = heroSections?.find(h => h.isActive) || heroSections?.[0];
  const serviceSection = serviceSections?.find(s => s.isActive) || serviceSections?.[0];
  const aboutSection = aboutSections?.find(a => a.isActive) || aboutSections?.[0];
  const featuredProperties = properties || [];
  const activeSliderImages = sliderImages?.filter(img => img.isActive) || [];

  // Helper to get localized text
  const getLocalizedText = (item, field) => {
    return isRTL ? item?.[`${field}Ar`] : item?.[`${field}En`];
  };

  // Handle search with tracking
  const handleSearch = (e) => {
    e.preventDefault();

    // Track search event
    metaPixelEvents.propertySearch(localFilters.search, {
      property_type_id: localFilters.propertyTypeId,
      transaction_type_id: localFilters.transactionTypeId,
      min_price: localFilters.minPrice,
      max_price: localFilters.maxPrice,
      min_area: localFilters.minArea,
      max_area: localFilters.maxArea,
      location: 'homepage_hero'
    });

    // Build query params
    const params = new URLSearchParams();
    if (localFilters.search) params.set('search', localFilters.search);
    if (localFilters.propertyTypeId) params.set('propertyTypeId', localFilters.propertyTypeId);
    if (localFilters.transactionTypeId) params.set('transactionTypeId', localFilters.transactionTypeId);
    if (localFilters.minPrice) params.set('minPrice', localFilters.minPrice);
    if (localFilters.maxPrice) params.set('maxPrice', localFilters.maxPrice);
    if (localFilters.minArea) params.set('minArea', localFilters.minArea);
    if (localFilters.maxArea) params.set('maxArea', localFilters.maxArea);
    params.set('page', '1');

    const queryString = params.toString();
    navigate(`/properties${queryString ? `?${queryString}` : ''}`);
  };

  const getLocalizedName = (item) => {
    return isRTL ? item.nameAr : item.nameEn;
  };

  const loading = heroLoading || servicesLoading || aboutLoading || slidersLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen-minus-header bg-neutral-50">
      {heroSection && (
        <HeroOption3
          heroSection={heroSection}
          isRTL={isRTL}
          t={t}
          getLocalizedText={getLocalizedText}
        />
      )}

      <SearchOption3
        localFilters={localFilters}
        setLocalFilters={setLocalFilters}
        propertyTypes={propertyTypes}
        transactionTypes={transactionTypes}
        handleSearch={handleSearch}
        getLocalizedName={getLocalizedName}
        isRTL={isRTL}
        t={t}
      />

      {aboutSection && (
        <AboutOption3
          aboutSection={aboutSection}
          heroSection={heroSection}
          isRTL={isRTL}
          t={t}
          getLocalizedText={getLocalizedText}
        />
      )}

      {activeSliderImages.length > 0 && (
        <SliderOption3
          activeSlider={sliders[0]}
          activeSliderImages={activeSliderImages}
          isRTL={isRTL}
        />
      )}

      <FeaturedPropertiesSection
        option={3}
        featuredProperties={featuredProperties}
        isRTL={isRTL}
        t={t}
        getLocalizedText={getLocalizedText}
        sectionTitle="Featured Properties"
        viewMode="grid"
        showFilters={true}
        showStats={true}
        itemsPerView={{
          mobile: 1,
          tablet: 2,
          desktop: 3,
          large: 4
        }}
      />

      {serviceSection && serviceSection.serviceItems && serviceSection.serviceItems.length > 0 && (
        <ServicesSection
          option={3}
          serviceSection={serviceSection}
          isRTL={isRTL}
          getLocalizedText={getLocalizedText}
        />
      )}

      <TestimonialsSection
        option={3}
        testimonials={activeTestimonials}
        isRTL={isRTL}
        t={t}
        getLocalizedText={getLocalizedText}
        sectionTitle="What Our Clients Say"
      />
    </div>
  );
}