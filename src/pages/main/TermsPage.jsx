// app/(main)/terms/page.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiFileText, FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function TermsPage() {
    const { t } = useTranslation();

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: 'By accessing and using DreamHome Real Estate website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.'
        },
        {
            title: '2. Use License',
            content: 'Permission is granted to temporarily access the materials (information or software) on DreamHome\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.'
        },
        {
            title: '3. User Accounts',
            content: 'When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.'
        },
        {
            title: '4. Property Listings',
            content: 'All property listings on our website are provided for informational purposes. While we strive to ensure accuracy, we do not guarantee the completeness or accuracy of any listing information. Property availability and pricing are subject to change without notice.'
        },
        {
            title: '5. User Conduct',
            content: 'You agree not to use our services for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You must not transmit any viruses, malware, or any code of a destructive nature.'
        },
        {
            title: '6. Intellectual Property',
            content: 'The service and its original content, features, and functionality are and will remain the exclusive property of DreamHome Real Estate. Our trademarks and trade dress may not be used without our prior written permission.'
        },
        {
            title: '7. Payment Terms',
            content: 'For services requiring payment, you agree to provide current, complete, and accurate purchase and account information. You agree to promptly update your account and payment information.'
        },
        {
            title: '8. Limitation of Liability',
            content: 'In no event shall DreamHome Real Estate, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the service.'
        },
        {
            title: '9. Disclaimer',
            content: 'Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the service.'
        },
        {
            title: '10. Termination',
            content: 'We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.'
        },
        {
            title: '11. Governing Law',
            content: 'These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which DreamHome Real Estate operates, without regard to its conflict of law provisions.'
        },
        {
            title: '12. Changes to Terms',
            content: 'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes. Your continued use of the service after changes become effective constitutes acceptance of the new Terms.'
        }
    ];

    const prohibited = [
        'Violating any applicable laws or regulations',
        'Posting false or misleading information',
        'Impersonating another person or entity',
        'Harassing, threatening, or abusing other users',
        'Attempting to gain unauthorized access to our systems',
        'Distributing spam or unsolicited messages',
        'Infringing on intellectual property rights',
        'Engaging in any fraudulent activity'
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-third-900   mb-4 font-serif">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-third-500">
                        Last updated: January 12, 2026
                    </p>
                </div>

                {/* Introduction */}
                <div className="mb-12 p-6 bg-primary-50   border border-primary-200   rounded-2xl">
                    <div className="flex items-start gap-4">
                        <FiFileText className="w-6 h-6 text-primary-600  shrink-0 mt-1" />
                        <p className="text-lg text-third-900   leading-relaxed">
                            Please read these Terms of Service carefully before using DreamHome Real Estate's website and services. These terms govern your use of our platform and services.
                        </p>
                    </div>
                </div>

                {/* Main Sections */}
                <div className="space-y-6 mb-12">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-bold text-third-900   mb-3 font-serif">
                                {section.title}
                            </h2>
                            <p className="text-third-500   leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Prohibited Activities */}
                <div className="mb-12 bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <FiXCircle className="w-6 h-6 text-error-600   shrink-0 mt-1" />
                        <div>
                            <h2 className="text-2xl font-bold text-third-900   mb-2 font-serif">
                                Prohibited Activities
                            </h2>
                            <p className="text-third-500">
                                The following activities are strictly prohibited when using our services:
                            </p>
                        </div>
                    </div>
                    <ul className="space-y-3 ms-10">
                        {prohibited.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <FiAlertCircle className="w-5 h-5 text-error-500 shrink-0 mt-0.5" />
                                <span className="text-third-500">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Agreement Section */}
                <div className="mb-12 bg-success-50   border border-success-200   rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <FiCheckCircle className="w-6 h-6 text-success-600   shrink-0 mt-1" />
                        <div>
                            <h2 className="text-xl font-bold text-third-900   mb-3 font-serif">
                                By Using Our Services
                            </h2>
                            <p className="text-third-500   leading-relaxed">
                                You acknowledge that you have read, understood, and agree to be bound by these Terms of Service. You also agree to comply with all applicable laws and regulations in connection with your use of our services.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="p-8 bg-linear-to-br from-primary-50 to-secondary-50     border border-primary-200   rounded-2xl text-center">
                    <h2 className="text-2xl font-bold text-third-900   mb-4 font-serif">
                        Questions About Our Terms?
                    </h2>
                    <p className="text-third-500   mb-6">
                        If you have any questions about these Terms of Service, please don't hesitate to contact us.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:legal@dreamhome.com"
                            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg"
                        >
                            Email Legal Team
                        </a>
                        <a
                            href="/contact-us"
                            className="px-6 py-3 bg-neutral-50   border border-neutral-400   text-third-900   font-semibold rounded-lg hover:bg-neutral-100   transition-all"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}