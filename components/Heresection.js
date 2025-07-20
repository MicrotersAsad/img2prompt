import { Lightbulb, MessageSquareText, TrendingUp } from 'lucide-react';
import React from 'react';


const HeroSection = () => (
  <section className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-lg  p-16 shadow-2xl mb-12">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
      
         Image to <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">Prompt</span>  Generator Online
      </h1>
      <p className="text-lg sm:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
        Unleash your creativity. Our AI analyzes your image and generates detailed, optimized prompts for your favorite AI art models.
      </p>
      <div className="flex justify-center flex-wrap gap-4">
        <div className="flex items-center text-white bg-white/20 px-4 py-2 rounded-full text-sm font-medium shadow-md">
          <MessageSquareText className="w-4 h-4 mr-2" />
          Detailed Descriptions
        </div>
        <div className="flex items-center text-white bg-white/20 px-4 py-2 rounded-full text-sm font-medium shadow-md">
          <Lightbulb className="w-4 h-4 mr-2" />
          Creative Ideas
        </div>
        <div className="flex items-center text-white bg-white/20 px-4 py-2 rounded-full text-sm font-medium shadow-md">
          <TrendingUp className="w-4 h-4 mr-2" />
          Optimized for AI
        </div>
      </div>
    </div>
  </section>
);
  
export default HeroSection;