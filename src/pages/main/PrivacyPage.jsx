// app/(main)/privacy/page.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiShield, FiLock, FiEye, FiDatabase } from 'react-icons/fi';

export default function PrivacyPolicyPage() {
    const { t } = useTranslation();

    const sections = [
        {
            icon: FiShield,
            title: 'Information We Collect',
            content: [
                'Personal information such as name, email, phone number, and address',
                'Property preferences and search history',
                'Communication history and inquiries',
                'Device information and browsing data',
                'Location data when you use our services'
            ]
        },
        {
            icon: FiDatabase,
            title: 'How We Use Your Information',
            content: [
                'To provide and improve our services',
                'To communicate with you about properties and services',
                'To personalize your experience and recommendations',
                'To process transactions and send notifications',
                'To analyze and enhance our platform performance'
            ]
        },
        {
            icon: FiLock,
            title: 'Data Protection',
            content: [
                'We use industry-standard encryption to protect your data',
                'Access to personal information is restricted to authorized personnel',
                'Regular security audits and updates are performed',
                'We comply with GDPR and other data protection regulations',
                'Your data is stored securely on protected servers'
            ]
        },
        {
            icon: FiEye,
            title: 'Your Rights',
            content: [
                'Access and review your personal data',
                'Request corrections to your information',
                'Delete your account and associated data',
                'Opt-out of marketing communications',
                'Export your data in a portable format'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-third-900   mb-4 font-serif">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-third-500">
                        Last updated: January 12, 2026
                    </p>
                </div>

                {/* Introduction */}
                <div className="mb-12 p-6 bg-primary-50   border border-primary-200   rounded-2xl">
                    <p className="text-lg text-third-900   leading-relaxed">
                        At DreamHome Real Estate, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8 mb-12">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={index}
                                className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-primary-100   rounded-xl">
                                        <Icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-third-900   font-serif">
                                        {section.title}
                                    </h2>
                                </div>
                                <ul className="space-y-3 ms-16">
                                    {section.content.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 shrink-0" />
                                            <span className="text-third-500">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Additional Sections */}
                <div className="space-y-8 mb-12">
                    <div className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-third-900   mb-4 font-serif">
                            Cookies and Tracking
                        </h2>
                        <p className="text-third-500   mb-4">
                            We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amounts of data which may include an anonymous unique identifier.
                        </p>
                        <p className="text-third-500">
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
                        </p>
                    </div>

                    <div className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-third-900   mb-4 font-serif">
                            Third-Party Services
                        </h2>
                        <p className="text-third-500   mb-4">
                            We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used.
                        </p>
                        <p className="text-third-500">
                            These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                        </p>
                    </div>

                    <div className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-third-900   mb-4 font-serif">
                            Children's Privacy
                        </h2>
                        <p className="text-third-500">
                            Our service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
                        </p>
                    </div>

                    <div className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-third-900   mb-4 font-serif">
                            Changes to This Policy
                        </h2>
                        <p className="text-third-500">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
                        </p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="p-8 bg-linear-to-br from-primary-50 to-secondary-50     border border-primary-200   rounded-2xl text-center">
                    <h2 className="text-2xl font-bold text-third-900   mb-4 font-serif">
                        Questions About Privacy?
                    </h2>
                    <p className="text-third-500   mb-6">
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:privacy@dreamhome.com"
                            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg"
                        >
                            Email Us
                        </a>
                        <a
                            href="/contact-us"
                            className="px-6 py-3 bg-neutral-50   border border-neutral-400   text-third-900   font-semibold rounded-lg hover:bg-neutral-100   transition-all"
                        >
                            Contact Form
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}