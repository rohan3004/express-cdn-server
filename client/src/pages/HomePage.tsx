import { Link } from 'react-router-dom';
import { Carousel } from '../components/Carousel';
import { mockContent } from '../data/mockData';
import { HeroPlayIcon } from '../components/Icons';
import { VideoPlayer } from '../components/VideoPlayer';
import type { Video } from '../data/mockData';

export const HomePage = () => {
    const featuredVideo: Video | undefined = mockContent.featured;

    return (
        <main className="pt-16 md:pt-20">
            <div className="relative w-full h-[40vh] md:h-[70vh] bg-black">
                {/* FIX: Changed the 'video' prop to 'src' and passed the correct value */}
                {featuredVideo && <VideoPlayer src={featuredVideo.videoSrc} isHeroPlayer={true} />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 md:p-10">
                    {featuredVideo?.logoUrl && <img src={featuredVideo.logoUrl} alt={`${featuredVideo.title} logo`} className="w-1/2 md:w-1/3 mb-2 md:mb-4"/>}
                    <p className="hidden md:block text-lg text-gray-300 max-w-2xl mb-6">{featuredVideo?.description}</p>
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <Link to={`/watch?video=${featuredVideo?.id}`} className="flex items-center justify-center bg-white text-black font-bold py-2 px-4 md:py-3 md:px-6 rounded-md hover:bg-gray-200 transition text-sm md:text-base">
                            <HeroPlayIcon />
                            Watch now
                        </Link>
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
};
