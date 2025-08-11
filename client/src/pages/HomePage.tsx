import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from '../components/Carousel';
import { mockContent } from '../data/mockData';
import { HeroPlayIcon, AddIcon, InfoIcon } from '../components/Icons';

export const HomePage = () => (
  <main className="pt-16 md:pt-20">
    <div className="relative w-full h-[40vh] md:h-[70vh]">
        <img src={mockContent.featured.thumbnailUrl} alt={mockContent.featured.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 md:p-10">
          {mockContent.featured.logoUrl && <img src={mockContent.featured.logoUrl} alt={`${mockContent.featured.title} logo`} className="w-1/2 md:w-1/3 mb-2 md:mb-4"/>}
          <p className="hidden md:block text-lg text-gray-300 max-w-2xl mb-6">{mockContent.featured.description}</p>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to={`/watch/${mockContent.featured.id}`} className="flex items-center justify-center bg-white text-black font-bold py-2 px-4 md:py-3 md:px-6 rounded-md hover:bg-gray-200 transition text-sm md:text-base">
              <HeroPlayIcon />
              Watch now
            </Link>
            <button className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition">
              <AddIcon />
            </button>
            <button className="hidden md:flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition">
              <InfoIcon />
            </button>
          </div>
        </div>
    </div>
    <div className="pt-4 md:pt-8">
        {mockContent.carousels.map(carousel => (
          <Carousel key={carousel.title} title={carousel.title} videos={carousel.videos} featured={carousel.featured} />
        ))}
    </div>
  </main>
);
