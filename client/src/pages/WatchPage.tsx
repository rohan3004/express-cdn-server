import { Link, useSearchParams } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';
import { mockContent } from '../data/mockData';

export const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoName = searchParams.get('video');
  
  // Corrected and robust search logic:
  // 1. Create a single, flat array containing ALL videos.
  // 2. Start with the main 'featured' video.
  // 3. Use flatMap to get all videos from every carousel and add them to the array.
  const allVideos = [
      mockContent.featured,
      ...mockContent.carousels.flatMap(carousel => carousel.videos)
    ];

  // 4. Find the video in the complete list where the ID matches the one from the URL.
  const video = allVideos.find(v => v.id === videoName);

  if (!video) {
    return <div className="pt-20 text-center text-2xl">Video not found! Please check the URL.</div>;
  }

  return (
    <main className="pt-20 px-4 py-4 lg:flex lg:space-x-8">
      <div className="lg:w-2/3">
        <VideoPlayer src={video.videoSrc} />
        <div className="mt-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white">{video.title}</h1>
          <div className="flex items-center flex-wrap space-x-4 mt-2 text-gray-400 text-sm md:text-base">
              <span>IMDB 8.8</span>
              <span>2h 31 min</span>
              <span>2024</span>
              <span className="border border-gray-400 px-1 text-xs">X-RAY</span>
              <span className="border border-gray-400 px-1 text-xs">UHD</span>
          </div>
          <p className="text-gray-300 text-base md:text-lg mt-4">{video.description}</p>
        </div>
      </div>
      <div className="lg:w-1/3 mt-8 lg:mt-0">
        <h3 className="text-xl font-bold text-white mb-4">Customers also watched</h3>
        <div className="space-y-4">
          {mockContent.carousels[0].videos.filter(v => v.id !== video.id).map(nextVideo => (
            <Link to={`/watch?video=${nextVideo.id}`} key={nextVideo.id} className="flex space-x-3 cursor-pointer group">
              <img src={nextVideo.thumbnailUrl} alt={nextVideo.title} className="w-40 h-24 object-cover rounded-lg transform group-hover:scale-105 transition-transform" />
              <div>
                <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#00a8e1]">{nextVideo.title}</h4>
                <p className="text-gray-400 text-xs mt-1">{nextVideo.uploader}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};
