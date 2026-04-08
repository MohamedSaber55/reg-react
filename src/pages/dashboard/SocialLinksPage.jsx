import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchSocialMediaLinks,
    createSocialMediaLinks,
    updateSocialMediaLinks,
} from '@/store/slices/socialMediaLinksSlice';
import {
    FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube,
    FiEdit, FiSave, FiX, FiGlobe,
} from 'react-icons/fi';
import {
    FaTiktok, FaSnapchatGhost, FaWhatsapp, FaTelegram,
    FaPinterest, FaReddit, FaMedium, FaTumblr, FaWeixin,
    FaLine, FaViber
} from 'react-icons/fa';
import { MdDomain } from 'react-icons/md';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { Switch } from '@/components/common/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';

// Social media platforms configuration - ONLY API-supported fields
const getSocialPlatforms = (t) => [
    // Social Media
    { key: 'facebook', label: 'Facebook', icon: FiFacebook, color: 'text-info-600', type: 'social' },
    { key: 'instagram', label: 'Instagram', icon: FiInstagram, color: 'text-pink-600', type: 'social' },
    { key: 'twitter', label: 'Twitter', icon: FiTwitter, color: 'text-sky-500', type: 'social' },
    { key: 'tikTok', label: 'TikTok', icon: FaTiktok, color: 'text-black', type: 'social' },
    { key: 'snapchat', label: 'Snapchat', icon: FaSnapchatGhost, color: 'text-warning-500', type: 'social' },
    { key: 'linkedIn', label: 'LinkedIn', icon: FiLinkedin, color: 'text-info-700', type: 'social' },
    { key: 'youTube', label: 'YouTube', icon: FiYoutube, color: 'text-error-600', type: 'social' },
    { key: 'whatsApp', label: 'WhatsApp', icon: FaWhatsapp, color: 'text-success-600', type: 'social' },
    { key: 'telegram', label: 'Telegram', icon: FaTelegram, color: 'text-info-500', type: 'social' },
    { key: 'pinterest', label: 'Pinterest', icon: FaPinterest, color: 'text-error-700', type: 'social' },
    { key: 'reddit', label: 'Reddit', icon: FaReddit, color: 'text-orange-600', type: 'social' },
    { key: 'medium', label: 'Medium', icon: FaMedium, color: 'text-black', type: 'social' },
    { key: 'tumblr', label: 'Tumblr', icon: FaTumblr, color: 'text-info-900', type: 'social' },
    { key: 'viber', label: 'Viber', icon: FaViber, color: 'text-purple-700', type: 'social' },
    { key: 'weChat', label: 'WeChat', icon: FaWeixin, color: 'text-success-500', type: 'social' },
    { key: 'line', label: 'Line', icon: FaLine, color: 'text-success-400', type: 'social' },

    // Real Estate Platforms
    { key: 'aqarmap', label: 'Aqarmap', icon: MdDomain, color: 'text-orange-500', type: 'realestate' },
    { key: 'dubizzle', label: 'Dubizzle', icon: MdDomain, color: 'text-info-800', type: 'realestate' },
    { key: 'propertyFinder', label: 'Property Finder', icon: MdDomain, color: 'text-error-600', type: 'realestate' },
    { key: 'bayut', label: 'Bayut', icon: MdDomain, color: 'text-success-700', type: 'realestate' },
    { key: 'justProperty', label: 'Just Property', icon: MdDomain, color: 'text-purple-600', type: 'realestate' },
    { key: 'olx', label: 'OLX', icon: MdDomain, color: 'text-success-600', type: 'realestate' },
    { key: 'zillow', label: 'Zillow', icon: MdDomain, color: 'text-info-600', type: 'realestate' },
    { key: 'realtor', label: 'Realtor', icon: MdDomain, color: 'text-info-700', type: 'realestate' },
    { key: 'trulia', label: 'Trulia', icon: MdDomain, color: 'text-teal-600', type: 'realestate' },
    { key: 'homesDotCom', label: 'Homes.com', icon: MdDomain, color: 'text-indigo-600', type: 'realestate' },
];

// Define initial values for Formik - ONLY API-supported fields
const initialValues = {
    // Social Media
    facebookUrl: '',
    facebookIsActive: true,
    twitterUrl: '',
    twitterIsActive: true,
    instagramUrl: '',
    instagramIsActive: true,
    tikTokUrl: '',
    tikTokIsActive: true,
    snapchatUrl: '',
    snapchatIsActive: true,
    linkedInUrl: '',
    linkedInIsActive: true,
    youTubeUrl: '',
    youTubeIsActive: true,
    whatsAppUrl: '',
    whatsAppIsActive: true,
    telegramUrl: '',
    telegramIsActive: true,
    pinterestUrl: '',
    pinterestIsActive: true,
    redditUrl: '',
    redditIsActive: true,
    mediumUrl: '',
    mediumIsActive: true,
    tumblrUrl: '',
    tumblrIsActive: true,
    viberUrl: '',
    viberIsActive: true,
    weChatUrl: '',
    weChatIsActive: true,
    lineUrl: '',
    lineIsActive: true,

    // Real Estate Platforms
    aqarmapUrl: '',
    aqarmapIsActive: true,
    dubizzleUrl: '',
    dubizzleIsActive: true,
    propertyFinderUrl: '',
    propertyFinderIsActive: true,
    bayutUrl: '',
    bayutIsActive: true,
    justPropertyUrl: '',
    justPropertyIsActive: true,
    olxUrl: '',
    olxIsActive: true,
    zillowUrl: '',
    zillowIsActive: true,
    realtorUrl: '',
    realtorIsActive: true,
    truliaUrl: '',
    truliaIsActive: true,
    homesDotComUrl: '',
    homesDotComIsActive: true,
};

// Helper function to create conditional validation for URL fields
const createConditionalUrlValidation = (activeField, t) => {
    return Yup.string()
        .test('url-validation', t('validation.invalidUrl'), function (value) {
            const isActive = this.parent[activeField];
            if (!isActive) {
                return true;
            }

            if (!value || value.trim() === '') {
                return true;
            }

            try {
                Yup.string().url().validateSync(value);
                return true;
            } catch {
                return false;
            }
        })
        .nullable();
};

// Define validation schema using Yup
const getValidationSchema = (t) => {
    return Yup.object().shape({
        // Social Media URLs
        facebookUrl: createConditionalUrlValidation('facebookIsActive', t),
        twitterUrl: createConditionalUrlValidation('twitterIsActive', t),
        instagramUrl: createConditionalUrlValidation('instagramIsActive', t),
        tikTokUrl: createConditionalUrlValidation('tikTokIsActive', t),
        snapchatUrl: createConditionalUrlValidation('snapchatIsActive', t),
        linkedInUrl: createConditionalUrlValidation('linkedInIsActive', t),
        youTubeUrl: createConditionalUrlValidation('youTubeIsActive', t),
        whatsAppUrl: createConditionalUrlValidation('whatsAppIsActive', t),
        telegramUrl: createConditionalUrlValidation('telegramIsActive', t),
        pinterestUrl: createConditionalUrlValidation('pinterestIsActive', t),
        redditUrl: createConditionalUrlValidation('redditIsActive', t),
        mediumUrl: createConditionalUrlValidation('mediumIsActive', t),
        tumblrUrl: createConditionalUrlValidation('tumblrIsActive', t),
        viberUrl: createConditionalUrlValidation('viberIsActive', t),
        weChatUrl: createConditionalUrlValidation('weChatIsActive', t),
        lineUrl: createConditionalUrlValidation('lineIsActive', t),

        // Real Estate URLs
        aqarmapUrl: createConditionalUrlValidation('aqarmapIsActive', t),
        dubizzleUrl: createConditionalUrlValidation('dubizzleIsActive', t),
        propertyFinderUrl: createConditionalUrlValidation('propertyFinderIsActive', t),
        bayutUrl: createConditionalUrlValidation('bayutIsActive', t),
        justPropertyUrl: createConditionalUrlValidation('justPropertyIsActive', t),
        olxUrl: createConditionalUrlValidation('olxIsActive', t),
        zillowUrl: createConditionalUrlValidation('zillowIsActive', t),
        realtorUrl: createConditionalUrlValidation('realtorIsActive', t),
        truliaUrl: createConditionalUrlValidation('truliaIsActive', t),
        homesDotComUrl: createConditionalUrlValidation('homesDotComIsActive', t),

        // Active fields - all boolean
        facebookIsActive: Yup.boolean(),
        twitterIsActive: Yup.boolean(),
        instagramIsActive: Yup.boolean(),
        tikTokIsActive: Yup.boolean(),
        snapchatIsActive: Yup.boolean(),
        linkedInIsActive: Yup.boolean(),
        youTubeIsActive: Yup.boolean(),
        whatsAppIsActive: Yup.boolean(),
        telegramIsActive: Yup.boolean(),
        pinterestIsActive: Yup.boolean(),
        redditIsActive: Yup.boolean(),
        mediumIsActive: Yup.boolean(),
        tumblrIsActive: Yup.boolean(),
        viberIsActive: Yup.boolean(),
        weChatIsActive: Yup.boolean(),
        lineIsActive: Yup.boolean(),
        aqarmapIsActive: Yup.boolean(),
        dubizzleIsActive: Yup.boolean(),
        propertyFinderIsActive: Yup.boolean(),
        bayutIsActive: Yup.boolean(),
        justPropertyIsActive: Yup.boolean(),
        olxIsActive: Yup.boolean(),
        zillowIsActive: Yup.boolean(),
        realtorIsActive: Yup.boolean(),
        truliaIsActive: Yup.boolean(),
        homesDotComIsActive: Yup.boolean(),
    });
};

export default function SocialLinksPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { socialMediaLinks, loading, operationLoading, error } = useAppSelector((state) => state.socialMediaLinks);

    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('social');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentId, setCurrentId] = useState(null);

    const validationSchema = useMemo(() => getValidationSchema(t), [t]);
    const socialPlatforms = useMemo(() => getSocialPlatforms(t), [t]);

    // Initialize Formik
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setSuccessMessage('');
            try {
                // Clean the data - remove empty strings and convert to null
                const cleanedValues = Object.keys(values).reduce((acc, key) => {
                    const value = values[key];
                    // Keep boolean values as-is
                    if (typeof value === 'boolean') {
                        acc[key] = value;
                    }
                    // Convert empty strings to null for URL fields
                    else if (typeof value === 'string') {
                        acc[key] = value.trim() === '' ? null : value.trim();
                    }
                    else {
                        acc[key] = value;
                    }
                    return acc;
                }, {});

                if (currentId) {
                    await dispatch(updateSocialMediaLinks({ id: currentId, data: cleanedValues })).unwrap();
                } else {
                    await dispatch(createSocialMediaLinks(cleanedValues)).unwrap();
                }

                setSuccessMessage(t('dashboard.socialLinksPage.successMessage'));
                setEditMode(false);

                // Refresh data
                await dispatch(fetchSocialMediaLinks({ pageNumber: 1, pageSize: 1 }));

                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                console.error('Failed to save social links:', err);
            }
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        dispatch(fetchSocialMediaLinks({ pageNumber: 1, pageSize: 1 }));
    }, [dispatch]);

    useEffect(() => {
        if (socialMediaLinks.length > 0) {
            const links = socialMediaLinks[0];
            setCurrentId(links.id);
            updateFormData(links);
        }
    }, [socialMediaLinks]);

    const updateFormData = (data) => {
        formik.setValues({
            // Social Media
            facebookUrl: data.facebookUrl || '',
            facebookIsActive: data.facebookIsActive ?? true,
            twitterUrl: data.twitterUrl || '',
            twitterIsActive: data.twitterIsActive ?? true,
            instagramUrl: data.instagramUrl || '',
            instagramIsActive: data.instagramIsActive ?? true,
            tikTokUrl: data.tikTokUrl || '',
            tikTokIsActive: data.tikTokIsActive ?? true,
            snapchatUrl: data.snapchatUrl || '',
            snapchatIsActive: data.snapchatIsActive ?? true,
            linkedInUrl: data.linkedInUrl || '',
            linkedInIsActive: data.linkedInIsActive ?? true,
            youTubeUrl: data.youTubeUrl || '',
            youTubeIsActive: data.youTubeIsActive ?? true,
            whatsAppUrl: data.whatsAppUrl || '',
            whatsAppIsActive: data.whatsAppIsActive ?? true,
            telegramUrl: data.telegramUrl || '',
            telegramIsActive: data.telegramIsActive ?? true,
            pinterestUrl: data.pinterestUrl || '',
            pinterestIsActive: data.pinterestIsActive ?? true,
            redditUrl: data.redditUrl || '',
            redditIsActive: data.redditIsActive ?? true,
            mediumUrl: data.mediumUrl || '',
            mediumIsActive: data.mediumIsActive ?? true,
            tumblrUrl: data.tumblrUrl || '',
            tumblrIsActive: data.tumblrIsActive ?? true,
            viberUrl: data.viberUrl || '',
            viberIsActive: data.viberIsActive ?? true,
            weChatUrl: data.weChatUrl || '',
            weChatIsActive: data.weChatIsActive ?? true,
            lineUrl: data.lineUrl || '',
            lineIsActive: data.lineIsActive ?? true,

            // Real Estate Platforms
            aqarmapUrl: data.aqarmapUrl || '',
            aqarmapIsActive: data.aqarmapIsActive ?? true,
            dubizzleUrl: data.dubizzleUrl || '',
            dubizzleIsActive: data.dubizzleIsActive ?? true,
            propertyFinderUrl: data.propertyFinderUrl || '',
            propertyFinderIsActive: data.propertyFinderIsActive ?? true,
            bayutUrl: data.bayutUrl || '',
            bayutIsActive: data.bayutIsActive ?? true,
            justPropertyUrl: data.justPropertyUrl || '',
            justPropertyIsActive: data.justPropertyIsActive ?? true,
            olxUrl: data.olxUrl || '',
            olxIsActive: data.olxIsActive ?? true,
            zillowUrl: data.zillowUrl || '',
            zillowIsActive: data.zillowIsActive ?? true,
            realtorUrl: data.realtorUrl || '',
            realtorIsActive: data.realtorIsActive ?? true,
            truliaUrl: data.truliaUrl || '',
            truliaIsActive: data.truliaIsActive ?? true,
            homesDotComUrl: data.homesDotComUrl || '',
            homesDotComIsActive: data.homesDotComIsActive ?? true,
        }, false);
    };

    const handleCancel = () => {
        if (socialMediaLinks.length > 0) {
            const links = socialMediaLinks[0];
            updateFormData(links);
        }
        setEditMode(false);
        formik.setErrors({});
        formik.setTouched({});
    };

    const filteredPlatforms = socialPlatforms.filter(platform => platform.type === activeTab);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-5">
                <div>
                    <h1 className="text-3xl font-bold text-third-900 font-serif mb-2">
                        {t('dashboard.socialLinksPage.title')}
                    </h1>
                    <p className="text-third-500">
                        {t('dashboard.socialLinksPage.description')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {!editMode ? (
                        <Button
                            variant="primary"
                            leftIcon={<FiEdit />}
                            onClick={() => setEditMode(true)}
                        >
                            {t('dashboard.socialLinksPage.editButton')}
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="secondary"
                                leftIcon={<FiX />}
                                onClick={handleCancel}
                                disabled={operationLoading}
                            >
                                {t('dashboard.forms.cancel')}
                            </Button>
                            <Button
                                variant="primary"
                                leftIcon={<FiSave />}
                                onClick={() => formik.handleSubmit()}
                                loading={operationLoading}
                                disabled={operationLoading}
                            >
                                {t('dashboard.socialLinksPage.saveButton')}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {successMessage && (
                <Alert variant="success" dismissible onDismiss={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert variant="error" dismissible>
                    {error}
                </Alert>
            )}

            {Object.keys(formik.errors).length > 0 && formik.submitCount > 0 && (
                <Alert variant="error" dismissible onDismiss={() => formik.setErrors({})}>
                    {t('dashboard.socialLinksPage.validationError')}
                </Alert>
            )}

            {/* Tabs */}
            <form onSubmit={formik.handleSubmit}>
                <Tabs defaultValue="social" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="social">{t('dashboard.socialLinksPage.tabs.social')}</TabsTrigger>
                        <TabsTrigger value="realestate">{t('dashboard.socialLinksPage.tabs.realestate')}</TabsTrigger>
                        <TabsTrigger value="preview">{t('dashboard.socialLinksPage.tabs.preview')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="social">
                        <SocialLinksGrid
                            platforms={filteredPlatforms}
                            formik={formik}
                            editMode={editMode}
                            operationLoading={operationLoading}
                            t={t}
                        />
                    </TabsContent>

                    <TabsContent value="realestate">
                        <SocialLinksGrid
                            platforms={filteredPlatforms}
                            formik={formik}
                            editMode={editMode}
                            operationLoading={operationLoading}
                            t={t}
                        />
                    </TabsContent>

                    <TabsContent value="preview">
                        <PreviewSection formData={formik.values} platforms={socialPlatforms} t={t} />
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    );
}

function SocialLinksGrid({ platforms, formik, editMode, operationLoading, t }) {
    return (
        <div className="bg-neutral-50 border border-neutral-400 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const urlField = `${platform.key}Url`;
                    const activeField = `${platform.key}IsActive`;
                    const error = formik.errors[urlField];
                    const touched = formik.touched[urlField];

                    return (
                        <div key={platform.key} className="space-y-3 p-4 border border-neutral-400 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 bg-neutral-50 rounded-lg ${platform.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <label className="text-sm font-semibold text-third-900">
                                        {platform.label}
                                    </label>
                                </div>
                                {editMode && (
                                    <Switch
                                        checked={formik.values[activeField]}
                                        onCheckedChange={(checked) => formik.setFieldValue(activeField, checked)}
                                        disabled={operationLoading}
                                    />
                                )}
                            </div>

                            {editMode ? (
                                <div className="space-y-1">
                                    <Input
                                        type="url"
                                        name={urlField}
                                        value={formik.values[urlField]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder={`${platform.label} URL`}
                                        disabled={operationLoading || !formik.values[activeField]}
                                        error={touched && error ? error : undefined}
                                    />
                                    {touched && error && (
                                        <div className="text-error-500 text-xs">{error}</div>
                                    )}
                                </div>
                            ) : (
                                <div className="px-4 py-3 rounded-xl bg-neutral-50 border-neutral-400">
                                    {formik.values[urlField] ? (
                                        <a
                                            href={formik.values[urlField]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 hover:underline break-all"
                                        >
                                            {formik.values[urlField]}
                                        </a>
                                    ) : (
                                        <span className="text-third-500 text-sm">
                                            {t('dashboard.socialLinksPage.notSet')}
                                        </span>
                                    )}
                                </div>
                            )}

                            {!editMode && (
                                <div className="flex items-center gap-2 text-xs text-third-500">
                                    <div className={`w-2 h-2 rounded-full ${formik.values[activeField] ? 'bg-success-500' : 'bg-neutral-400'}`} />
                                    <span>{formik.values[activeField] ? t('dashboard.socialLinksPage.visible') : t('dashboard.socialLinksPage.hidden')}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PreviewSection({ formData, platforms, t }) {
    const activePlatforms = platforms.filter(platform => {
        const urlField = `${platform.key}Url`;
        const activeField = `${platform.key}IsActive`;
        return formData[urlField] && formData[activeField];
    });

    return (
        <div className="bg-neutral-50 border border-neutral-400 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-third-900 mb-6 font-serif">
                {t('dashboard.socialLinksPage.preview.title')}
            </h2>

            {activePlatforms.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        {activePlatforms.map((platform) => {
                            const Icon = platform.icon;
                            const urlField = `${platform.key}Url`;

                            return (
                                <a
                                    key={platform.key}
                                    href={formData[urlField]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-400 hover:bg-primary-100 hover:border-primary-500 transition-all duration-300 ${platform.color}`}
                                    title={platform.label}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium text-third-900">
                                        {platform.label}
                                    </span>
                                </a>
                            );
                        })}
                    </div>

                    <div className="mt-6 p-4 bg-neutral-50 border-neutral-400 rounded-xl">
                        <h3 className="text-sm font-semibold text-third-900 mb-2">
                            {t('dashboard.socialLinksPage.preview.totalLinks', { count: activePlatforms.length })}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {activePlatforms.map(platform => (
                                <div key={platform.key} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${platform.color.split(' ')[0]}`} />
                                    <span className="text-third-900">{platform.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-50 border-neutral-400 flex items-center justify-center">
                        <FiGlobe className="w-8 h-8 text-third-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-third-900 mb-2">
                        {t('dashboard.socialLinksPage.preview.noLinks')}
                    </h3>
                    <p className="text-third-500 mb-4">
                        {t('dashboard.socialLinksPage.preview.noLinksDescription')}
                    </p>
                </div>
            )}
        </div>
    );
}