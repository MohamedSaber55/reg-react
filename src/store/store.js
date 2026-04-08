import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import finishingLevelReducer from './slices/finishingLevelSlice';
import furnishingStatusReducer from './slices/furnishingStatusSlice';
import propertyReducer from './slices/propertySlice';
import propertyStatusReducer from './slices/propertyStatusSlice';
import propertyTypeReducer from './slices/propertyTypeSlice';
import transactionTypeReducer from './slices/transactionTypeSlice';
import socialMediaLinksReducer from './slices/socialMediaLinksSlice';
import ticketReducer from './slices/ticketSlice';
import sliderImageReducer from './slices/sliderImageSlice';
import sliderReducer from './slices/sliderSlice';
import testimonialReducer from './slices/testimonialSlice';
import contactEmailReducer from './slices/contactEmailSlice';
import contactPhoneReducer from './slices/contactPhoneSlice';
import faqReducer from './slices/faqSlice';
import mapSectionReducer from './slices/mapSectionSlice';
import businessHourReducer from './slices/businessHourSlice';
import userManagementReducer from './slices/userManagementSlice';
import aboutSectionReducer from './slices/aboutSectionSlice';
import aboutValueReducer from './slices/aboutValueSlice';
import addressReducer from './slices/addressSlice';
import contactPageReducer from './slices/contactPageSlice';
import serviceSectionReducer from './slices/serviceSectionSlice';
import serviceItemReducer from './slices/serviceItemSlice';
import stageReducer from './slices/stageSlice';
import unitModelReducer from './slices/unitModelSlice';
import unitModelImageReducer from './slices/unitModelImageSlice';
import dashboardReducer from './slices/dashboardSlice';
import heroSectionReducer from './slices/heroSectionSlice';
import projectReducer from './slices/projectSlice';
import metaPixelReducer from './slices/metaPixelSlice';

export const store = configureStore({
    reducer: {
        language: languageReducer,
        theme: themeReducer,
        auth: authReducer,
        finishingLevel: finishingLevelReducer,
        furnishingStatus: furnishingStatusReducer,
        property: propertyReducer,
        propertyStatus: propertyStatusReducer,
        propertyType: propertyTypeReducer,
        transactionType: transactionTypeReducer,
        socialMediaLinks: socialMediaLinksReducer,
        ticket: ticketReducer,
        sliderImage: sliderImageReducer,
        slider: sliderReducer,
        testimonial: testimonialReducer,
        contactEmail: contactEmailReducer,
        contactPhone: contactPhoneReducer,
        faq: faqReducer,
        mapSection: mapSectionReducer,
        businessHour: businessHourReducer,
        userManagement: userManagementReducer,
        aboutSection: aboutSectionReducer,
        aboutValue: aboutValueReducer,
        address: addressReducer,
        contactPage: contactPageReducer,
        serviceSection: serviceSectionReducer,
        serviceItem: serviceItemReducer,
        stage: stageReducer,
        unitModel: unitModelReducer,
        unitModelImage: unitModelImageReducer,
        dashboard: dashboardReducer,
        heroSection: heroSectionReducer,
        project: projectReducer,
        tracking: metaPixelReducer
    },
});