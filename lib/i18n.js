// lib/i18n.js
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "Image to Prompt",
      subtitle: "Transform your images into professional AI prompts with advanced machine learning",
      home: "Home",
      blog: "Blog", 
      contact: "Contact",
      signIn: "Sign In",
      getStarted: "Get Started",
      startCreating: "Start Creating",
      viewPricing: "View Pricing",
      promptsGenerated: "Prompts Generated",
      happyUsers: "Happy Users",
      uptime: "Uptime",
      imageToPrompt: "Image to Prompt",
      veo3Generator: "Veo3 Generator",
      transformImages: "Transform your images into detailed AI prompts",
      generateVideoPrompts: "Generate professional video prompts for Veo3",
      poweredBy: "Powered by Advanced AI",
      aiPromptGenerators: "AI Prompt Generators",
      toolsDescription: "Choose from our powerful AI tools to create professional prompts for different platforms",
      powerfulFeatures: "Powerful Features",
      featuresDescription: "Everything you need to create amazing AI prompts",
      lightningFast: "Lightning Fast",
      lightningFastDesc: "Generate professional prompts in seconds with our optimized AI engine",
      securePrivate: "Secure & Private",
      securePrivateDesc: "Your images and data are processed securely and never stored permanently",
      globalAccess: "Global Access",
      globalAccessDesc: "Access our platform from anywhere in the world, 24/7 availability",
      teamCollaboration: "Team Collaboration",
      teamCollaborationDesc: "Share and collaborate on prompts with your team members",
      support247: "24/7 Support",
      support247Desc: "Get help whenever you need it with our round-the-clock support",
      premiumQuality: "Premium Quality",
      premiumQualityDesc: "High-quality prompts that deliver exceptional results",
      userTestimonials: "What Our Users Say",
      testimonial1: "This tool has revolutionized my workflow. The prompts are incredibly detailed and accurate!",
      user1Name: "Sarah Ahmed",
      user1Title: "Digital Artist",
      testimonial2: "Perfect for my design agency. We save hours of work with these AI-generated prompts.",
      user2Name: "Rafiq Hassan",
      user2Title: "Creative Director",
      testimonial3: "The Veo3 generator creates amazing video prompts. Quality is outstanding!",
      user3Name: "Fatima Khan",
      user3Title: "Content Creator",
      ctaTitle: "Ready to Transform Your Images?",
      ctaDescription: "Join thousands of creators who are already using Image to Prompt to enhance their creative workflow",
      // Contact Page
      contactTitle: "Get in Touch",
      contactSubtitle: "Have questions about Image to Prompt? We're here to help you succeed with AI-powered creativity",
      sendMessage: "Send us a Message",
      firstName: "First Name",
      firstNamePlaceholder: "John",
      lastName: "Last Name",
      lastNamePlaceholder: "Doe",
      emailAddress: "Email Address",
      emailPlaceholder: "john@example.com",
      subject: "Subject",
      selectSubject: "Select a subject",
      technicalSupport: "Technical Support",
      billingQuestion: "Billing Question",
      featureRequest: "Feature Request",
      partnership: "Partnership",
      other: "Other",
      message: "Message",
      messagePlaceholder: "Tell us how we can help you...",
      sendMessageButton: "Send Message",
      contactInformation: "Contact Information",
      email: "Email",
      phone: "Phone",
      address: "Address",
      addressLine1: "House 123, Road 456",
      addressLine2: "Dhanmondi, Dhaka 1205",
      addressLine3: "Bangladesh",
      businessHours: "Business Hours",
      mondayFriday: "Monday - Friday: 9:00 AM - 6:00 PM",
      saturday: "Saturday: 10:00 AM - 4:00 PM",
      sunday: "Sunday: Closed",
      quickAnswers: "Quick Answers",
      faq1Question: "How fast do you respond?",
      faq1Answer: "We typically respond within 24 hours during business days.",
      faq2Question: "Do you offer phone support?",
      faq2Answer: "Yes, phone support is available for premium subscribers.",
      faq3Question: "Can I schedule a demo?",
      faq3Answer: "Absolutely! Contact us to schedule a personalized demo.",
      // Footer
      product: "Product",
      pricing: "Pricing",
      features: "Features",
      api: "API",
      company: "Company",
      about: "About",
      support: "Support",
      helpCenter: "Help Center",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      footerDescription: "Transform your creative workflow with AI-powered prompt generation",
      allRightsReserved: "All rights reserved"
    }
  },
  bn: {
    translation: {
      title: "এআই প্রম্পট স্টুডিও",
      subtitle: "উন্নত মেশিন লার্নিং দিয়ে আপনার ছবিগুলোকে পেশাদার এআই প্রম্পটে রূপান্তর করুন",
      home: "হোম",
      blog: "ব্লগ",
      contact: "যোগাযোগ",
      signIn: "সাইন ইন",
      getStarted: "শুরু করুন",
      startCreating: "তৈরি করা শুরু করুন",
      viewPricing: "মূল্য দেখুন",
      promptsGenerated: "প্রম্পট তৈরি হয়েছে",
      happyUsers: "সন্তুষ্ট ব্যবহারকারী",
      uptime: "আপটাইম",
      imageToPrompt: "ছবি থেকে প্রম্পট",
      veo3Generator: "ভিইও৩ জেনারেটর",
      transformImages: "আপনার ছবিগুলোকে বিস্তারিত এআই প্রম্পটে রূপান্তর করুন",
      generateVideoPrompts: "ভিইও৩ এর জন্য পেশাদার ভিডিও প্রম্পট তৈরি করুন",
      poweredBy: "উন্নত এআই দ্বারা চালিত",
      aiPromptGenerators: "এআই প্রম্পট জেনারেটর",
      toolsDescription: "বিভিন্ন প্ল্যাটফর্মের জন্য পেশাদার প্রম্পট তৈরি করতে আমাদের শক্তিশালী এআই টুল বেছে নিন",
      powerfulFeatures: "শক্তিশালী বৈশিষ্ট্য",
      featuresDescription: "অসাধারণ এআই প্রম্পট তৈরির জন্য প্রয়োজনীয় সবকিছু",
      lightningFast: "বিদ্যুৎ গতি",
      lightningFastDesc: "আমাদের অপ্টিমাইজড এআই ইঞ্জিন দিয়ে সেকেন্ডেই পেশাদার প্রম্পট তৈরি করুন",
      securePrivate: "নিরাপদ ও ব্যক্তিগত",
      securePrivateDesc: "আপনার ছবি ও ডেটা নিরাপদে প্রক্রিয়াজাত হয় এবং স্থায়ীভাবে সংরক্ষিত হয় না",
      globalAccess: "বিশ্বব্যাপী অ্যাক্সেস",
      globalAccessDesc: "বিশ্বের যেকোনো স্থান থেকে আমাদের প্ল্যাটফর্ম ব্যবহার করুন, ২৪/৭ উপলব্ধতা",
      teamCollaboration: "টিম সহযোগিতা",
      teamCollaborationDesc: "আপনার টিম সদস্যদের সাথে প্রম্পট শেয়ার ও সহযোগিতা করুন",
      support247: "২৪/৭ সাপোর্ট",
      support247Desc: "যখনই প্রয়োজন আমাদের সার্বক্ষণিক সাপোর্ট নিন",
      premiumQuality: "প্রিমিয়াম মান",
      premiumQualityDesc: "উচ্চ মানের প্রম্পট যা ব্যতিক্রমী ফলাফল প্রদান করে",
      userTestimonials: "আমাদের ব্যবহারকারীরা কী বলেন",
      testimonial1: "এই টুলটি আমার কাজের ধারা পুরোপুরি পরিবর্তন করে দিয়েছে। প্রম্পটগুলো অবিশ্বাস্যভাবে বিস্তারিত এবং নির্ভুল!",
      user1Name: "সারাহ আহমেদ",
      user1Title: "ডিজিটাল আর্টিস্ট",
      testimonial2: "আমার ডিজাইন এজেন্সির জন্য নিখুঁত। এই এআই-জেনারেটেড প্রম্পট দিয়ে আমরা ঘন্টার পর ঘন্টা কাজ বাঁচাই।",
      user2Name: "রফিক হাসান",
      user2Title: "ক্রিয়েটিভ ডিরেক্টর",
      testimonial3: "ভিইও৩ জেনারেটর অসাধারণ ভিডিও প্রম্পট তৈরি করে। মানটা অত্যুৎকৃষ্ট!",
      user3Name: "ফাতিমা খান",
      user3Title: "কন্টেন্ট ক্রিয়েটর",
      ctaTitle: "আপনার ছবিগুলো রূপান্তর করতে প্রস্তুত?",
      ctaDescription: "হাজারো সৃজনশীল মানুষের সাথে যোগ দিন যারা ইতিমধ্যে এআই প্রম্পট স্টুডিও ব্যবহার করে তাদের সৃজনশীল কর্মপ্রবাহ উন্নত করছেন",
      // Contact Page - Bengali
      contactTitle: "যোগাযোগ করুন",
      contactSubtitle: "এআই প্রম্পট স্টুডিও সম্পর্কে কোন প্রশ্ন আছে? এআই-চালিত সৃজনশীলতায় সফল হতে আমরা এখানে আপনাকে সাহায্য করার জন্য আছি",
      sendMessage: "আমাদের একটি বার্তা পাঠান",
      firstName: "প্রথম নাম",
      firstNamePlaceholder: "জন",
      lastName: "শেষ নাম",
      lastNamePlaceholder: "ডো",
      emailAddress: "ইমেইল ঠিকানা",
      emailPlaceholder: "john@example.com",
      subject: "বিষয়",
      selectSubject: "একটি বিষয় নির্বাচন করুন",
      technicalSupport: "টেকনিক্যাল সাপোর্ট",
      billingQuestion: "বিলিং প্রশ্ন",
      featureRequest: "ফিচার অনুরোধ",
      partnership: "পার্টনারশিপ",
      other: "অন্যান্য",
      message: "বার্তা",
      messagePlaceholder: "আমরা আপনাকে কীভাবে সাহায্য করতে পারি তা বলুন...",
      sendMessageButton: "বার্তা পাঠান",
      contactInformation: "যোগাযোগের তথ্য",
      email: "ইমেইল",
      phone: "ফোন",
      address: "ঠিকানা",
      addressLine1: "বাড়ি ১২৩, রোড ৪৫৬",
      addressLine2: "ধানমন্ডি, ঢাকা ১২০৫",
      addressLine3: "বাংলাদেশ",
      businessHours: "কার্যকাল",
      mondayFriday: "সোমবার - শুক্রবার: সকাল ৯:০০ - সন্ধ্যা ৬:০০",
      saturday: "শনিবার: সকাল ১০:০০ - বিকাল ৪:০০",
      sunday: "রবিবার: বন্ধ",
      quickAnswers: "দ্রুত উত্তর",
      faq1Question: "আপনারা কত দ্রুত উত্তর দেন?",
      faq1Answer: "আমরা সাধারণত কার্যদিবসে ২৪ ঘন্টার মধ্যে উত্তর দিই।",
      faq2Question: "আপনারা কি ফোন সাপোর্ট দেন?",
      faq2Answer: "হ্যাঁ, প্রিমিয়াম সাবস্ক্রাইবারদের জন্য ফোন সাপোর্ট উপলব্ধ।",
      faq3Question: "আমি কি একটি ডেমো শিডিউল করতে পারি?",
      faq3Answer: "অবশ্যই! একটি ব্যক্তিগতকৃত ডেমো শিডিউল করতে আমাদের সাথে যোগাযোগ করুন।",
      // Footer
      product: "পণ্য",
      pricing: "মূল্য",
      features: "বৈশিষ্ট্য",
      api: "এপিআই",
      company: "কোম্পানি",
      about: "সম্পর্কে",
      support: "সাপোর্ট",
      helpCenter: "সহায়তা কেন্দ্র",
      privacyPolicy: "গোপনীয়তা নীতি",
      termsOfService: "সেবার শর্তাবলী",
      footerDescription: "এআই-চালিত প্রম্পট জেনারেশনের মাধ্যমে আপনার সৃজনশীল কর্মপ্রবাহ রূপান্তর করুন",
      allRightsReserved: "সকল অধিকার সংরক্ষিত"
    }
  }
};

// Initialize i18n
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;