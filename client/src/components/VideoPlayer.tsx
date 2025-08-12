import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlayIcon, PauseIcon, VolumeHighIcon, VolumeMuteIcon, Rewind10Icon, Forward10Icon, SettingsIcon, PictureInPictureIcon } from './Icons';

// New Icons for Enlarge/Shrink (Fullscreen)
const EnlargeIcon = () => (<svg className="w-7 h-7 fill-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></svg>);
const ShrinkIcon = () => (<svg className="w-7 h-7 fill-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"></path></svg>);


export const VideoPlayer = ({ src: videoIdentifier, isHeroPlayer = false }: { src: string, isHeroPlayer?: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isInPiP, setIsInPiP] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [showSeekIndicator, setShowSeekIndicator] = useState<'forward' | 'backward' | null>(null);
    const [showActionIndicator, setShowActionIndicator] = useState<'play' | 'pause' | 'volumeUp' | 'volumeDown' | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const settingsMenuRef = useRef<HTMLDivElement>(null);
    const touchTimer = useRef<NodeJS.Timeout | null>(null);
    const lastTap = useRef(0);
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const fullVideoSrc = `/api/video/${videoIdentifier}`;
    const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

    const updateUrlParams = useCallback(() => {
        const videoId = searchParams.get('video');
        if (!videoId || isHeroPlayer) return;

        const params = new URLSearchParams();
        params.set('video', videoId);
        params.set('playback_speed', String(playbackRate));
        params.set('pip', String(isInPiP));
        navigate(`?${params.toString()}`, { replace: true });
    }, [playbackRate, isInPiP, navigate, searchParams, isHeroPlayer]);

    useEffect(() => {
        updateUrlParams();
    }, [updateUrlParams]);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const triggerIndicator = useCallback((setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
        setter(value);
        setTimeout(() => setter(null), 500);
    }, []);

    const handleSeek = useCallback((amount: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
            triggerIndicator(setShowSeekIndicator, amount > 0 ? 'forward' : 'backward');
        }
    }, [triggerIndicator]);
    
    const handleJumpToPercentage = useCallback((percentage: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = videoRef.current.duration * (percentage / 100);
        }
    }, []);

    const togglePlayPause = useCallback(() => {
        if(isHeroPlayer) return;
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                triggerIndicator(setShowActionIndicator, 'play');
            } else {
                videoRef.current.pause();
                triggerIndicator(setShowActionIndicator, 'pause');
            }
        }
    }, [isHeroPlayer, triggerIndicator]);

    const handleVolumeChange = useCallback((newVolume: number) => {
        if(videoRef.current) {
            const currentVolume = videoRef.current.volume;
            const finalVolume = Math.max(0, Math.min(1, newVolume));
            videoRef.current.volume = finalVolume;
            videoRef.current.muted = finalVolume === 0;

            if (finalVolume > currentVolume) triggerIndicator(setShowActionIndicator, 'volumeUp');
            else if (finalVolume < currentVolume) triggerIndicator(setShowActionIndicator, 'volumeDown');
        }
    }, [triggerIndicator]);
    
    const toggleMute = useCallback(() => {
        if(videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
        }
    }, []);

    const toggleFullScreen = useCallback(() => {
        if (!document.fullscreenElement) { videoContainerRef.current?.requestFullscreen(); } else { document.exitFullscreen(); }
    }, []);

    const handlePlaybackRateChange = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
            setIsSettingsOpen(false);
        }
    };

    const togglePictureInPicture = useCallback(async () => {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else if (videoRef.current && document.pictureInPictureEnabled) {
            await videoRef.current.requestPictureInPicture();
        }
    }, []);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if(isHeroPlayer) return;
        e.preventDefault();
        const now = new Date().getTime();
        const timeSinceLastTap = now - lastTap.current;
        const touchX = e.touches[0].clientX;
        const screenWidth = window.innerWidth;

        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) { // Double tap
            if (touchTimer.current) clearTimeout(touchTimer.current);
            lastTap.current = 0;
            if (touchX > screenWidth * 0.6) {
                handleSeek(10);
            } else if (touchX < screenWidth * 0.4) {
                handleSeek(-10);
            }
        } else { // Single tap
            touchTimer.current = setTimeout(() => {
                // This timeout is cleared on double-tap, so it only fires for single taps
            }, 300);
        }
        lastTap.current = now;
    };

    useEffect(() => {
        const video = videoRef.current;
        
        const handleTimeUpdate = () => video && setCurrentTime(video.currentTime);
        const handleDurationChange = () => video && setDuration(video.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleVolume = () => {
            if(video) {
                setVolume(video.volume);
                setIsMuted(video.muted);
            }
        }
        const handleFullscreenChange = () => setIsFullScreen(!!document.fullscreenElement);
        const handleEnterPiP = () => setIsInPiP(true);
        const handleLeavePiP = () => setIsInPiP(false);

        if (video) {
            // Set initial state from URL params
            const initialSpeed = parseFloat(searchParams.get('playback_speed') || '1');
            handlePlaybackRateChange(initialSpeed);

            if (searchParams.get('pip') === 'true' && !document.pictureInPictureElement) {
                togglePictureInPicture();
            }

            video.addEventListener('timeupdate', handleTimeUpdate);
            video.addEventListener('volumechange', handleVolume);
            video.addEventListener('loadedmetadata', handleDurationChange);
            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePause);
            video.addEventListener('enterpictureinpicture', handleEnterPiP);
            video.addEventListener('leavepictureinpicture', handleLeavePiP);
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if(isHeroPlayer) return;
             switch(e.key.toLowerCase()) {
                case ' ': case 'k': e.preventDefault(); togglePlayPause(); break;
                case 'm': toggleMute(); break;
                case 'f': toggleFullScreen(); break;
                case 'i': togglePictureInPicture(); break;
                case 'j': handleSeek(-10); break;
                case 'l': handleSeek(10); break;
                case 'arrowleft': handleSeek(-5); break;
                case 'arrowright': handleSeek(5); break;
                case 'arrowup': e.preventDefault(); if(videoRef.current) handleVolumeChange(videoRef.current.volume + 0.1); break;
                case 'arrowdown': e.preventDefault(); if(videoRef.current) handleVolumeChange(videoRef.current.volume - 0.1); break;
                case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
                    handleJumpToPercentage(parseInt(e.key) * 10);
                    break;
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        const handleClickOutside = (event: MouseEvent) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            if (video) {
                video.removeEventListener('timeupdate', handleTimeUpdate);
                video.removeEventListener('volumechange', handleVolume);
                video.removeEventListener('loadedmetadata', handleDurationChange);
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePause);
                video.removeEventListener('enterpictureinpicture', handleEnterPiP);
                video.removeEventListener('leavepictureinpicture', handleLeavePiP);
            }
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isHeroPlayer, searchParams, togglePlayPause, toggleMute, toggleFullScreen, togglePictureInPicture, handleSeek, handleVolumeChange, handleJumpToPercentage]);

    return (
        <div ref={videoContainerRef} className={`group w-full relative bg-black ${isHeroPlayer ? 'h-full' : 'aspect-video'}`} onTouchStart={handleTouchStart}>
            <video ref={videoRef} src={fullVideoSrc} className={`w-full h-full ${isHeroPlayer ? 'object-cover' : 'object-contain'}`} autoPlay={!isHeroPlayer} muted={isHeroPlayer} loop={isHeroPlayer} playsInline onPlay={()=>setIsPaused(false)} onPause={()=>setIsPaused(true)} onClick={togglePlayPause} />
            
            {!isHeroPlayer && (
                <>
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showSeekIndicator || showActionIndicator ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                        <div className="bg-black/50 p-4 rounded-full flex items-center justify-center w-24 h-24">
                            {showSeekIndicator === 'forward' && <i className="fas fa-forward text-white text-4xl"></i>}
                            {showSeekIndicator === 'backward' && <i className="fas fa-backward text-white text-4xl"></i>}
                            {showActionIndicator === 'play' && <i className="fas fa-play text-white text-4xl"></i>}
                            {showActionIndicator === 'pause' && <i className="fas fa-pause text-white text-4xl"></i>}
                            {showActionIndicator === 'volumeUp' && <i className="fas fa-volume-up text-white text-4xl"></i>}
                            {showActionIndicator === 'volumeDown' && <i className="fas fa-volume-down text-white text-4xl"></i>}
                        </div>
                    </div>

                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-4 transition-opacity duration-300 ${isPaused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className="cursor-pointer" onClick={(e) => {
                            if (videoRef.current) {
                                const progressBar = e.currentTarget;
                                const clickPosition = e.nativeEvent.offsetX;
                                const barWidth = progressBar.offsetWidth;
                                const newTime = (clickPosition / barWidth) * duration;
                                videoRef.current.currentTime = newTime;
                            }
                        }}>
                            <div className="bg-white/30 h-1 group-hover:h-1.5 transition-all duration-200 rounded-full">
                                <div className="bg-[#00a8e1] h-full rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <button onClick={() => handleSeek(-10)} className="p-1"><Rewind10Icon /></button>
                                <button onClick={togglePlayPause} className="p-1">{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
                                <button onClick={() => handleSeek(10)} className="p-1"><Forward10Icon /></button>
                                <div className="flex items-center group/volume">
                                   <button onClick={toggleMute} className="p-1">{volume === 0 || isMuted ? <VolumeMuteIcon /> : <VolumeHighIcon />}</button>
                                    <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} className="w-0 h-1 group-hover/volume:w-24 opacity-0 group-hover/volume:opacity-100 transition-all duration-300 ml-1 accent-[#00a8e1]" />
                                </div>
                                <div className="text-sm font-mono">{formatTime(currentTime)} / {formatTime(duration)}</div>
                            </div>
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <div className="relative" ref={settingsMenuRef}>
                                    <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-1"><SettingsIcon /></button>
                                    {isSettingsOpen && (
                                        <div className="absolute bottom-full right-0 mb-2 bg-black/80 rounded-md p-2 space-y-1 w-40">
                                            <div className="text-white text-sm px-2">Playback Speed</div>
                                            {playbackRates.map(rate => (
                                                <button 
                                                    key={rate} 
                                                    onClick={() => handlePlaybackRateChange(rate)}
                                                    className={`w-full text-left px-2 py-1 rounded-sm text-sm ${playbackRate === rate ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/20'}`}
                                                >
                                                    {rate === 1 ? 'Normal' : `${rate}x`}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {document.pictureInPictureEnabled && <button onClick={togglePictureInPicture} className="p-1"><PictureInPictureIcon /></button>}
                                <button onClick={toggleFullScreen} className="p-1">{isFullScreen ? <ShrinkIcon /> : <EnlargeIcon />}</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
