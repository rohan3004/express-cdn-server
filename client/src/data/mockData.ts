// --- TYPE DEFINITIONS ---
export interface Video {
  id: string; // Changed from number to string
  title: string;
  thumbnailUrl: string;
  logoUrl?: string;
  videoSrc: string; // Now just the filename, e.g., 'alps.mp4'
  uploader: string;
  views: string;
  uploaded: string;
  description: string;
}

export interface CarouselData {
  title: string;
  videos: Video[];
  featured?: boolean;
}

// --- MOCK DATA ---
export const mockContent = {
  featured: {
    id: "dil main baji guitar",
    title: "A Serene Journey Through the Swiss Alps",
    logoUrl: "https://placehold.co/300x100/0f172a/ffffff?text=ALPINE+ODYSSEY",
    thumbnailUrl:
      "https://placehold.co/1280x720/0f172a/ffffff?text=Featured+Video",
    videoSrc: "temp2.mp4",
    uploader: "Nature Explorers",
    views: "2.1M views",
    uploaded: "3 weeks ago",
    description:
      "Experience the breathtaking beauty of the Swiss Alps. From lush green valleys to snow-capped peaks, this journey captures the serene and majestic landscapes of one of the world's most stunning mountain ranges.",
  },
  carousels: [
    {
      title: "Prime - Recommended for you",
      videos: [
        {
          id: "dil pe chalaiye churia",
          title: "Ocean Waves: A Calming Drone Perspective",
          thumbnailUrl: "https://placehold.co/600x400/1e40af/ffffff?text=Ocean",
          videoSrc: "temp3.mp4",
          uploader: "Coastal Drones",
          views: "5.8M views",
          uploaded: "1 month ago",
          description:
            "Relax and unwind with this stunning 4K drone footage of ocean waves crashing on a pristine beach.",
        },
        {
          id: "dum ghutkoon",
          title: "Exploring Tokyo at Night",
          thumbnailUrl: "https://placehold.co/600x400/3b82f6/ffffff?text=Tokyo",
          videoSrc: "temp1.mp4",
          uploader: "City Wanderer",
          views: "3.2M views",
          uploaded: "2 months ago",
          description: "Immerse yourself in the vibrant nightlife of Tokyo.",
        },
        {
          id: "harry potter",
          title: "The Northern Lights: A Celestial Dance",
          thumbnailUrl:
            "https://placehold.co/600x400/60a5fa/ffffff?text=Aurora",
          videoSrc: "videoplayback.mp4",
          uploader: "Sky Watchers",
          views: "7.5M views",
          uploaded: "1 week ago",
          description: "Witness the magical phenomenon of the Aurora Borealis.",
        },
      ],
    },
    {
      title: "Featured Originals",
      featured: true,
      videos: [
        {
          id: "rift",
          title: "Rift Valley",
          logoUrl: "https://placehold.co/200x80/000000/ffffff?text=RIFT+VALLEY",
          thumbnailUrl:
            "https://placehold.co/600x400/be123c/ffffff?text=Original+1",
          videoSrc: "temp1.mp4",
          uploader: "Prime Studios",
          views: "12M views",
          uploaded: "1 day ago",
          description:
            "In a fractured timeline, a lone warrior must mend the rifts to save reality.",
        },
        {
          id: "cybernetic",
          title: "Cybernetic Dawn",
          logoUrl:
            "https://placehold.co/200x80/000000/ffffff?text=CYBERNETIC+DAWN",
          thumbnailUrl:
            "https://placehold.co/600x400/be185d/ffffff?text=Original+2",
          videoSrc: "videoplayback.mp4",
          uploader: "Prime Studios",
          views: "8M views",
          uploaded: "2 days ago",
          description:
            "The first sentient AI rethinks its relationship with its creators.",
        },
        {
          id: "starship",
          title: "The Last Starship",
          logoUrl:
            "https://placehold.co/200x80/000000/ffffff?text=THE+LAST+STARSHIP",
          thumbnailUrl:
            "https://placehold.co/600x400/9d174d/ffffff?text=Original+3",
          videoSrc: "starship.mp4",
          uploader: "Prime Studios",
          views: "22M views",
          uploaded: "3 days ago",
          description: "Humanity's last hope journeys to a distant galaxy.",
        },
      ],
    },
  ],
};
