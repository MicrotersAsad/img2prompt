// app/page.tsx
'use client';

import React, { useState } from 'react';
import { Sparkles, Zap, Shield, Globe, ArrowRight, Star, Users, Clock, Video, Image as ImageIcon, ChevronDown, UploadCloud, FileText, Wand, Lightbulb, TrendingUp, Brush } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout'; // Assuming Layout.js also has 'use client';
import ImageToPromptGenerator from '../components/ImageToPromptGenerator';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper modules
import { Autoplay, FreeMode } from 'swiper/modules'; // Import Autoplay and FreeMode

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode'; // Required for FreeMode

export default function HomePage() {
  const { t } = useTranslation();

  // Sample testimonial data - increased for better rolling effect
  const testimonials = [
    {
      id: 1,
      stars: 5,
      textKey: 'testimonial1',
      textDefault: 'This tool has revolutionized my workflow. The prompts are incredibly detailed and accurate!',
      userNameKey: 'user1Name',
      userNameDefault: 'Sarah Ahmed',
      userTitleKey: 'user1Title',
      userTitleDefault: 'Digital Artist',
    },
    {
      id: 2,
      stars: 5,
      textKey: 'testimonial2',
      textDefault: 'Perfect for my design agency. We save hours of work with these AI-generated prompts.',
      userNameKey: 'user2Name',
      userNameDefault: 'Rafiq Hassan',
      userTitleKey: 'user2Title',
      userTitleDefault: 'Creative Director',
    },
    {
      id: 3,
      stars: 5,
      textKey: 'testimonial3',
      textDefault: 'The prompts are so inspiring! My art has reached a new level.',
      userNameKey: 'user3Name',
      userNameDefault: 'Fatima Khan',
      userTitleKey: 'user3Title',
      userTitleDefault: 'Content Creator',
    },
    {
      id: 4,
      stars: 5,
      textKey: 'testimonial4',
      textDefault: 'A must-have for anyone serious about AI art. The prompt quality is unmatched.',
      userNameKey: 'user4Name',
      userNameDefault: 'Omar Ali',
      userTitleKey: 'user4Title',
      userTitleDefault: 'AI Enthusiast',
    },
    {
      id: 5,
      stars: 5,
      textKey: 'testimonial5',
      textDefault: 'I used to struggle with prompts, now I create masterpieces effortlessly!',
      userNameKey: 'user5Name',
      userNameDefault: 'Priya Devi',
      userTitleKey: 'user5Title',
      userTitleDefault: 'Hobbyist Artist',
    },
    {
      id: 6,
      stars: 5,
      textKey: 'testimonial6',
      textDefault: 'The best prompt generator out there. Highly recommend for any creative.',
      userNameKey: 'user6Name',
      userNameDefault: 'Ahmed Bilal',
      userTitleKey: 'user6Title',
      userTitleDefault: 'Game Developer',
    },
    {
      id: 7,
      stars: 5,
      textKey: 'testimonial7',
      textDefault: 'Incredible precision and speed. My design workflow has never been smoother.',
      userNameKey: 'user7Name',
      userNameDefault: 'Nadia Begum',
      userTitleKey: 'user7Title',
      userTitleDefault: 'UI/UX Designer',
    },
    {
      id: 8,
      stars: 5,
      textKey: 'testimonial8',
      textDefault: 'From concept to creation, this tool makes AI art truly accessible and enjoyable.',
      userNameKey: 'user8Name',
      userNameDefault: 'Kamal Hossain',
      userTitleKey: 'user8Title',
      userTitleDefault: 'Architect',
    },
    {
      id: 9,
      stars: 5,
      textKey: 'testimonial9',
      textDefault: 'The nuances captured by the AI are phenomenal. My art now stands out.',
      userNameKey: 'user9Name',
      userNameDefault: 'Lena Petrova',
      userTitleKey: 'user9Title',
      userTitleDefault: 'Illustrator',
    },
    {
      id: 10,
      stars: 5,
      textKey: 'testimonial10',
      textDefault: 'Absolutely indispensable for modern digital artists. A true game-changer.',
      userNameKey: 'user10Name',
      userNameDefault: 'Ivan Smirnov',
      userTitleKey: 'user10Title',
      userTitleDefault: '3D Modeler',
    },
  ];

  // Divide testimonials into two rows
  const testimonialsRow1 = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const testimonialsRow2 = testimonials.slice(Math.ceil(testimonials.length / 2));

  // FAQ Data
  const faqs = [
    {
      id: 1,
      questionKey: 'faq1Question',
      questionDefault: 'What is AI Prompt Studio?',
      answerKey: 'faq1Answer',
      answerDefault: 'AI Prompt Studio is an innovative platform that leverages advanced artificial intelligence to generate detailed and optimized prompts from images, text, and other media, designed for various AI art and content generation models like Midjourney, DALL-E 3, and Stable Diffusion.',
    },
    {
      id: 2,
      questionKey: 'faqImgPrompt1Question',
      questionDefault: 'How accurate is the Image to Prompt generation?',
      answerKey: 'faqImgPrompt1Answer',
      answerDefault: 'Our Image to Prompt AI generator uses state-of-the-art AI to analyze your image\'s visual characteristics, including style, composition, lighting, and color palette. While accuracy can vary based on image complexity, it consistently provides highly relevant and detailed prompts, often capturing nuances you might miss.',
    },
    {
      id: 3,
      questionKey: 'faqImgPrompt2Question',
      questionDefault: 'What image formats and sizes are supported for the Image to Prompt generator online?',
      answerKey: 'faqImgPrompt2Answer',
      answerDefault: 'You can upload common image formats such as JPG, PNG, and WEBP. We recommend keeping file sizes under 10MB for optimal performance, though our system is designed to handle various resolutions. We support direct file uploads, pasting from clipboard, and using image URLs.',
    },
    {
      id: 4,
      questionKey: 'faqImgPrompt3Question',
      questionDefault: 'Can I specify the output language or AI model for the generated prompt using this image to text prompt generator?',
      answerKey: 'faqImgPrompt3Answer',
      answerDefault: 'Yes, absolutely! Before generating your prompt, you can choose from various output languages (e.g., English, Spanish, French) and specify the target AI model (e.g., Midjourney, DALL-E 3, Stable Diffusion, Flux AI) for tailored results from our image to AI prompt generator online.',
    },
    {
      id: 5,
      questionKey: 'faq3Question',
      questionDefault: 'Is my data secure and private?',
      answerKey: 'faq3Answer',
      answerDefault: 'Yes, absolutely. We prioritize your privacy and data security. All uploaded images and generated prompts are processed securely and are never shared with third parties without your explicit consent. We use industry-standard encryption protocols.',
    },
    {
      id: 6,
      questionKey: 'faq4Question',
      questionDefault: 'What AI models are supported for prompt generation?',
      answerKey: 'faq4Answer',
      answerDefault: 'Our platform generates prompts optimized for a wide range of popular AI models, including Midjourney, DALL-E 3, Stable Diffusion, and Flux. You can select your target model in the settings for tailored results.',
    },
    {
      id: 7,
      questionKey: 'faq5Question',
      questionDefault: 'Do you offer a free trial or free plan for the image to prompt AI free feature?',
      answerKey: 'faq5Answer',
      answerDefault: 'Yes, we offer a generous free plan that allows you to generate a limited number of prompts per month. This is perfect for trying out our image to prompt free feature. For more extensive usage, we offer various paid subscription tiers.',
    },
    {
      id: 8,
      questionKey: 'faq6Question',
      questionDefault: 'Can I enhance my existing prompts with the best image to prompt generator?',
      answerKey: 'faq6Answer',
      answerDefault: 'Our "Prompt Enhancer" tool is designed specifically for this purpose. You can input your basic prompt, and our AI will suggest additional keywords, styles, and technical parameters to make it more effective and detailed, solidifying our position as the best image to prompt generator AI.',
    },
  ];

  const [openFaq, setOpenFaq] = useState(null); // State to manage which FAQ is open

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <Layout>
      {/* ImageToPromptGenerator component */}
      <div className='max-w-10xl'>
        <ImageToPromptGenerator authLoading={undefined} t={t} />
      </div>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('howItWorksTitle', 'How Our Image to Prompt AI Generator Works')}
          </h2>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto mb-16">
            {t('howItWorksDescription', 'Transform your visuals into powerful AI art prompts in just a few simple steps with our image to prompt AI generator.')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1: Upload Image */}
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl border border-white/20 shadow-xl transition-transform hover:scale-105 duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{t('step1Title', 'Upload Your Image')}</h3>
              <p className="text-purple-200 text-center leading-relaxed">
                Start by uploading any image to our image to prompt AI tool. You can drag & drop, select a file, paste from your clipboard, or even use an image URL. It's a seamless experience for your image to prompt free generation.
              </p>
            </div>

            {/* Step 2: AI Analyzes & Generates */}
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl border border-white/20 shadow-xl transition-transform hover:scale-105 duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{t('step2Title', 'AI Analyzes & Generates')}</h3>
              <p className="text-purple-200 text-center leading-relaxed">
                Our advanced AI quickly processes your image, identifies key elements, styles, and moods. It then automatically crafts a detailed and optimized text prompt, making us the best image to prompt generator for your needs.
              </p>
            </div>

            {/* Step 3: Copy & Create */}
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-xl border border-white/20 shadow-xl transition-transform hover:scale-105 duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-6">
                <Wand className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{t('step3Title', 'Copy Your Prompt & Create')}</h3>
              <p className="text-purple-200 text-center leading-relaxed">
                Instantly copy the generated prompt and paste it into your favorite AI art tool (like Midjourney, DALL-E, Stable Diffusion, or Flux AI image to prompt generator). Watch your vision come to life with the perfect image to AI prompt converter.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <Link href="/img-to-prompt" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center">
              {t('tryImageToPrompt', 'Try Image to Prompt Now')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      {/* --- END How It Works Section --- */}


      {/* --- Why Choose Us Section (img2prompt specific) --- */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('whyChooseUsTitle', 'Why Choose AI Prompt Studio\'s Image to Prompt?')}
            </h2>
            <p className="text-purple-200 text-lg max-w-3xl mx-auto">
              {t('whyChooseUsDescription', 'Discover why our image to prompt AI generator is the preferred choice for artists and creators.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1: Unmatched Accuracy */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Lightbulb className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('benefit1Title', 'Unmatched Prompt Accuracy')}</h3>
              <p className="text-purple-200">{t('benefit1Desc', 'Our image to prompt ai utilizes advanced AI to analyze intricate details, ensuring highly accurate and relevant text prompts for your creative vision.')}</p>
            </div>

            {/* Benefit 2: Streamlined Workflow */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('benefit2Title', 'Streamlined Creative Workflow')}</h3>
              <p className="text-purple-200">{t('benefit2Desc', 'Save hours of manual prompt engineering. Our image to prompt generator online quickly transforms your visuals, letting you focus on artistry.')}</p>
            </div>

            {/* Benefit 3: Versatile Input */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <UploadCloud className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('benefit3Title', 'Versatile Input Options')}</h3>
              <p className="text-purple-200">{t('benefit3Desc', 'Upload files, paste from clipboard, or use an image URL. Our image to prompt extension capability makes it easy to get started.')}</p>
            </div>

            {/* Benefit 4: AI Model Optimization */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Zap className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('benefit4Title', 'Optimized for Top AI Models')}</h3>
              <p className="text-purple-200">{t('benefit4Desc', 'Generate prompts specifically tuned for Midjourney, DALL-E 3, Stable Diffusion, and Flux AI image to prompt generator, ensuring superior results.')}</p>
            </div>

            {/* Benefit 5: Creativity Catalyst */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Brush className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('benefit5Title', 'Ignite Your Creativity')}</h3>
              <p className="text-purple-200">{t('benefit5Desc', 'Break through art blocks! Our best image to prompt generator AI transforms visual inspiration into detailed prompts, helping you explore new artistic frontiers.')}</p>
            </div>

            {/* Benefit 6: Accessibility (Free Tier) */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Shield className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('benefit6Title', 'Accessible & Free Options')}</h3>
              <p className="text-purple-200">{t('benefit6Desc', 'Start creating with our image to prompt free tier. Experience the power of our image to prompt AI free tool before upgrading for extended features.')}</p>
            </div>
          </div>
        </div>
      </section>
      {/* --- END Why Choose Us Section --- */}


      {/* Features Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('powerfulFeatures', 'Powerful Features')}
            </h2>
            <p className="text-purple-200 text-lg">
              {t('featuresDescription', 'Discover what makes our platform stand out.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('lightningFast', 'Lightning-Fast Generation')}</h3>
              <p className="text-purple-200">{t('lightningFastDesc', 'Generate prompts in seconds, not minutes. Our optimized AI ensures rapid results.')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('securePrivate', 'Secure & Private')}</h3>
              <p className="text-purple-200">{t('securePrivateDesc', 'Your data and creations are protected with industry-leading encryption and privacy measures.')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Globe className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('globalAccess', 'Global Access')}</h3>
              <p className="text-purple-200">{t('globalAccessDesc', 'Access our tools from anywhere in the world, 24/7, across all your devices.')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Users className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('teamCollaboration', 'Team Collaboration')}</h3>
              <p className="text-purple-200">{t('teamCollaborationDesc', 'Share projects and collaborate seamlessly with your team members in a shared workspace.')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Clock className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('support247', '24/7 Support')}</h3>
              <p className="text-purple-200">{t('support247Desc', 'Our dedicated support team is available around the clock to assist you with any questions or issues.')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Star className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('premiumQuality', 'Premium Quality Output')}</h3>
              <p className="text-purple-200">{t('premiumQualityDesc', 'Expect nothing less than high-quality, relevant, and creative prompts tailored to your needs.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Rolling Section (Two Rows) */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('userTestimonials', 'What Our Users Say')}
            </h2>
          </div>

          {/* First Row: Rolling from Right */}
          {/* Added `overflow-hidden` to clip the content outside the container */}
          {/* `hover:paused` class (defined in global CSS) to pause animation on hover */}
          <div className="testimonial-row-container mb-8 overflow-hidden hover:paused">
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={30}
              slidesPerView={'auto'} // 'auto' to let slides define their width
              loop={true}
              autoplay={{
                delay: 0, // No delay, continuous scroll
                disableOnInteraction: false,
                reverseDirection: false, // Scrolls from right to left
              }}
              freeMode={true} // Enables free movement of slides
              speed={5000} // Duration of one loop cycle (adjust for speed)
              className="mySwiper testimonials-row-1"
            >
              {testimonialsRow1.map((testimonial) => (
                <SwiperSlide key={testimonial.id} style={{ width: '320px' }}> {/* Fixed width for consistency */}
                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/20 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-purple-200 mb-4">
                        {t(testimonial.textKey, testimonial.textDefault)}
                      </p>
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {t(testimonial.userNameKey, testimonial.userNameDefault)}
                      </div>
                      <div className="text-purple-300 text-sm">
                        {t(testimonial.userTitleKey, testimonial.userTitleDefault)}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Second Row: Rolling from Left */}
          {/* Added `overflow-hidden` and `hover:paused` */}
          <div className="testimonial-row-container overflow-hidden hover:paused">
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={30}
              slidesPerView={'auto'}
              loop={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true, // Scrolls from left to right
              }}
              freeMode={true}
              speed={5000} // Duration of one loop cycle (adjust for speed)
              className="mySwiper testimonials-row-2"
            >
              {testimonialsRow2.map((testimonial) => (
                <SwiperSlide key={testimonial.id} style={{ width: '320px' }}> {/* Fixed width for consistency */}
                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/20 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-purple-200 mb-4">
                        {t(testimonial.textKey, testimonial.textDefault)}
                      </p>
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {t(testimonial.userNameKey, testimonial.userNameDefault)}
                      </div>
                      <div className="text-purple-300 text-sm">
                        {t(testimonial.userTitleKey, testimonial.userTitleDefault)}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('faqTitle', 'Frequently Asked Questions')}
            </h2>
            <p className="text-purple-200 text-lg">
              {t('faqDescription', 'Find answers to common questions about our platform and services.')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <h3 className="text-lg font-semibold text-white">
                    {t(faq.questionKey, faq.questionDefault)}
                  </h3>
                  <ChevronDown
                    className={`w-6 h-6 text-purple-300 transition-transform duration-300 ${
                      openFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === faq.id && (
                  <div className="px-6 pb-6 pt-2 text-purple-200 leading-relaxed animate-fade-in-down">
                    <p>{t(faq.answerKey, faq.answerDefault)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Main AI Tool Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Related Tools
            </h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              {t('toolsDescription', 'Choose from our powerful AI tools to create professional prompts for different platforms')}
            </p>
          </div>

          {/* Tools Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Image to Prompt Tool */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                  Image to Prompt
                </h3>
              </div>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Upload any image and get detailed, professional prompts. Perfect for recreating styles, analyzing compositions, or generating similar content.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-purple-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  AI Powered Analysis
                </div>
                <div>
                  <Link className="flex items-center text-blue-300 font-small" href="img-to-prompt">Try Now
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Prompt to Image Tool */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                  Prompt to Image
                </h3>
              </div>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Transform your ideas into stunning visuals with Azure DALL-E 3. Create professional-quality images from detailed text descriptions.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-purple-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  AI Powered Creation
                </div>
                <Link className="flex items-center text-blue-300 font-small" href="prompt-to-image">Try Now
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Smart Prompt Generator */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-green-300 transition-colors">
                  Smart Prompt Generator
                </h3>
              </div>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Generate optimized prompts for any AI model. Get suggestions, enhance your ideas, and create prompts that produce better results.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-purple-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Multi-Platform Support
                </div>
                <Link className="flex items-center text-blue-300 font-small" href="image-prompt-generator">Try Now
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Video to Prompt Tool - CORRECTED LINK */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-red-300 transition-colors">
                  Video to Prompt
                </h3>
              </div>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Extract detailed prompts from video content. Analyze scenes, movements, and styles to create comprehensive text descriptions.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-purple-300">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  Coming Soon
                </div>
                {/* Corrected Link component */}
                <Link className="flex items-center text-red-300 font-medium" href="#">Preview
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link> {/* Closing Link tag added */}
              </div>
            </div>

            {/* Audio to Prompt Tool - CORRECTED LINK */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  Audio to Prompt
                </h3>
              </div>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Convert audio descriptions, music, and sounds into visual prompts. Perfect for creating mood-based imagery from audio content.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-purple-300">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                  Coming Soon
                </div>
                {/* Corrected Link component */}
                <Link className="flex items-center text-indigo-300 font-medium" href="#">Preview
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link> {/* Closing Link tag added */}
              </div>
            </div>

            {/* Prompt Enhancer Tool */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-yellow-300 transition-colors">
                  Prompt Enhancer
                </h3>
              </div>
              <p className="text-purple-200 mb-6 leading-relaxed">
                Take your basic prompts to the next level. Add style keywords, improve clarity, and optimize for better AI generation results.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-purple-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  AI Enhancement
                </div>
                <Link className="flex items-center text-blue-300 font-small" href="prompt-enhancer">Try Now
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Client-side Interactive Components */}
          <div className="text-center mb-8">
            <span className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-full shadow-lg">
              {t('poweredBy', 'Powered by Advanced AI')}
            </span>
          </div>
        </div>
      </section>

      {/* Global styles for Swiper navigation/pagination and FAQ animation */}
      <style jsx global>{`
        /* Swiper custom styles for navigation/pagination visibility */
        .swiper-button-prev,
        .swiper-button-next {
            color: #fff;
            background-color: rgba(139, 92, 246, 0.7);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            display: none; /* Hide default Swiper navigation buttons if not needed for continuous scroll */
        }

        .swiper-pagination-bullet { background-color: rgba(255, 255, 255, 0.4); opacity: 1; }
        .swiper-pagination-bullet-active { background-color: #ec4899; }

        /* FAQ animation for answer reveal */
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }

        /* --- Continuous Rolling Animations for Testimonials --- */

        /* Container for each testimonial row to control overflow and mask */
        .testimonial-row-container {
            position: relative;
            width: 100%;
            /* Mask to fade out content at the edges */
            mask-image: linear-gradient(to right,
              hsl(0 0% 0% / 0),
              hsl(0 0% 0% / 1) 20%,
              hsl(0 0% 0% / 1) 80%,
              hsl(0 0% 0% / 0)
            );
        }

        /* Ensure smooth, linear transition for continuous scroll */
        .swiper-wrapper {
          transition-timing-function: linear !important;
          -webkit-transition-timing-function: linear !important;
        }

        /* Pause animation on hover for the entire row container */
        .testimonial-row-container:hover .swiper-wrapper {
            animation-play-state: paused;
        }

      `}</style>
    </Layout>
  );
}