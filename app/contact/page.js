'use client';

import React from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200 mb-4">
              {t('contactTitle', 'Get in Touch')}
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              {t('contactSubtitle', "Have questions about AI Prompt Studio? We're here to help you succeed with AI-powered creativity")}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/20">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('sendMessage', 'Send us a Message')}
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-purple-200 mb-2">
                        {t('firstName', 'First Name')}
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                        placeholder={t('firstNamePlaceholder', 'John')}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-purple-200 mb-2">
                        {t('lastName', 'Last Name')}
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                        placeholder={t('lastNamePlaceholder', 'Doe')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                      {t('emailAddress', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      placeholder={t('emailPlaceholder', 'john@example.com')}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-purple-200 mb-2">
                      {t('subject', 'Subject')}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 [&>option]:bg-purple-900 [&>option]:text-white [&>option:checked]:bg-purple-700"
                    >
                      <option value="" className="bg-purple-900 text-white">{t('selectSubject', 'Select a subject')}</option>
                      <option value="support" className="bg-purple-900 text-white">{t('technicalSupport', 'Technical Support')}</option>
                      <option value="billing" className="bg-purple-900 text-white">{t('billingQuestion', 'Billing Question')}</option>
                      <option value="feature" className="bg-purple-900 text-white">{t('featureRequest', 'Feature Request')}</option>
                      <option value="partnership" className="bg-purple-900 text-white">{t('partnership', 'Partnership')}</option>
                      <option value="other" className="bg-purple-900 text-white">{t('other', 'Other')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-purple-200 mb-2">
                      {t('message', 'Message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                      placeholder={t('messagePlaceholder', "Tell us how we can help you...")}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {t('sendMessageButton', 'Send Message')}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/20">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {t('contactInformation', 'Contact Information')}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{t('email', 'Email')}</h4>
                        <p className="text-purple-200">support@aiprompt.studio</p>
                        <p className="text-purple-200">hello@aiprompt.studio</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{t('phone', 'Phone')}</h4>
                        <p className="text-purple-200">+880 1700-000000</p>
                        <p className="text-purple-200">+880 1800-000000</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{t('address', 'Address')}</h4>
                        <p className="text-purple-200">
                          {t('addressLine1', 'House 123, Road 456')}<br />
                          {t('addressLine2', 'Dhanmondi, Dhaka 1205')}<br />
                          {t('addressLine3', 'Bangladesh')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{t('businessHours', 'Business Hours')}</h4>
                        <p className="text-purple-200">
                          {t('mondayFriday', 'Monday - Friday: 9:00 AM - 6:00 PM')}<br />
                          {t('saturday', 'Saturday: 10:00 AM - 4:00 PM')}<br />
                          {t('sunday', 'Sunday: Closed')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/20">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {t('quickAnswers', 'Quick Answers')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        {t('faq1Question', 'How fast do you respond?')}
                      </h4>
                      <p className="text-purple-200 text-sm">
                        {t('faq1Answer', 'We typically respond within 24 hours during business days.')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        {t('faq2Question', 'Do you offer phone support?')}
                      </h4>
                      <p className="text-purple-200 text-sm">
                        {t('faq2Answer', 'Yes, phone support is available for premium subscribers.')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        {t('faq3Question', 'Can I schedule a demo?')}
                      </h4>
                      <p className="text-purple-200 text-sm">
                        {t('faq3Answer', 'Absolutely! Contact us to schedule a personalized demo.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}