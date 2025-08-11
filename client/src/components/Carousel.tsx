import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Video } from '../data/mockData';
import { HeroPlayIcon } from './Icons';

const VideoCard = ({ video }: { video: Video }) => (
  <Link to={`/watch?video=${video.id}`} className="flex-shrink-0 w-64 md:w-72 cursor-pointer group">
    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-auto object-cover rounded-md transform group-hover:scale-105 transition-transform duration-300" />
    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <h3 className="text-white text-md font-semibold truncate">{video.title}</h3>
      <p className="text-gray-400 text-sm">{video.uploader}</p>
    </div>
  </Link>
);

const FeaturedCarouselCard = ({ video }: { video: Video }) => {
    const navigate = useNavigate();

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button, a')) {
            return;
        }
        navigate(`/watch?video=${video.id}`);
    };

    return (
        <div className="relative flex-shrink-0 w-80 md:w-96 cursor-pointer group" onClick={handleCardClick}>
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-auto object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 group-hover:translate-y-4 pointer-events-none">
                {video.logoUrl && <img src={video.logoUrl} alt={`${video.title} logo`} className="w-2/3 mb-4"/>}
                <div className="flex items-center space-x-2 pointer-events-auto">
                    <Link to={`/watch?video=${video.id}`} className="flex items-center justify-center bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-gray-200 transition text-sm">
                        <HeroPlayIcon />
                        Play S1 E1
                    </Link>
                </div>
            </div>
        </div>
    );
};


export const Carousel = ({ title, videos, featured }: { title: string; videos: Video[]; featured?: boolean; }) => (
  <div className="mb-8">
    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-10">{title}</h2>
    <div className="flex space-x-4 overflow-x-auto pb-4 px-4 md:px-10 scrollbar-hide">
      {videos.map(video => featured ? 
        <FeaturedCarouselCard key={video.id} video={video} /> : 
        <VideoCard key={video.id} video={video} />
      )}
    </div>
  </div>
);
