import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Video as VideoIcon,
  Maximize2,
  Sparkles,
  MapPin,
  ShieldCheck
} from 'lucide-react';

export default function HeroMediaShowcase() {
  const { media } = useApp();
  
  const resolveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
    if (url.startsWith('/')) return import.meta.env.BASE_URL + url.slice(1);
    return import.meta.env.BASE_URL + url;
  };

  const videoData = media?.video || {
    url: '/final_video.mp4',
    title: 'Chhaya Mobiles Workshop & Store Showcase'
  };

  const images = (media?.images && media.images.length > 0) ? media.images : [
    {
      id: 'img-1',
      title: 'Storefront Exterior — Sony Dharmshala, Chitrakoot',
      caption: 'Prime retail location at Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P.',
      url: '/exterior.png'
    },
    {
      id: 'img-2',
      title: 'Precision Micro-soldering Workshop Interior',
      caption: 'State-of-the-art diagnostic benches and certified gadget showcases',
      url: '/interior.png'
    }
  ];

  // Mode: 'video' | 'slider'
  const [currentMode, setCurrentMode] = useState('video');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted per user request
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef(null);

  // Initialize and attempt unmuted autoplay on load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAudioBlocked(false);
        })
        .catch((err) => {
          console.log('Autoplay blocked unmuted, trying muted:', err);
          video.muted = true;
          setIsMuted(true);
          setAudioBlocked(true);
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        });
    }
  }, [videoData.url]);

  // Video Time Update & Progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  // When Video Ends -> Automatically switch to Image Slider
  const handleVideoEnded = () => {
    setCurrentMode('slider');
    setCurrentSlide(0);
  };

  // Image Slider Auto-rotation
  useEffect(() => {
    if (currentMode !== 'slider' || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [currentMode, images.length]);

  // Toggle Mute / Unmute
  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) setAudioBlocked(false);
    }
  };

  // Unmute Audio Banner Click
  const handleUnmuteAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setAudioBlocked(false);
      videoRef.current.play();
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Replay Video
  const handleReplayVideo = () => {
    setCurrentMode('video');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all">
      
      {/* ─── VIDEO PLAYER VIEW ─── */}
      {currentMode === 'video' && (
        <div className="relative aspect-16/9 sm:aspect-21/9 min-h-[220px] sm:min-h-[380px] md:min-h-[480px] w-full flex items-center justify-center bg-black overflow-hidden group">
          
          <video
            ref={videoRef}
            key={videoData.url}
            src={resolveUrl(videoData.url)}
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />

          {/* Autoplay Audio Blocked Banner Overlay */}
          {audioBlocked && (
            <button
              onClick={handleUnmuteAudio}
              className="absolute top-4 left-4 z-30 px-3.5 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce-short transition-transform active:scale-95"
            >
              <VolumeX className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>Click to Unmute Audio 🔊</span>
            </button>
          )}

          {/* Bottom Video Controls Overlay */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 flex flex-col justify-end gap-2">
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-white text-xs">
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlay} 
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button 
                  onClick={toggleMute} 
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
                </button>

                <div className="hidden sm:block text-left">
                  <span className="font-extrabold text-sm block leading-tight">{videoData.title || 'Chhaya Mobiles Workshop Tour'}</span>
                  <span className="text-[11px] text-slate-400">Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham</span>
                </div>
              </div>

              {/* Mode Switcher Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMode('slider')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md flex items-center gap-1.5 transition-all"
                >
                  <ImageIcon className="w-4 h-4 text-cyan-300" />
                  <span>View Photos ({images.length})</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ─── AUTOMATIC IMAGE SLIDER VIEW ─── */}
      {currentMode === 'slider' && (
        <div className="relative aspect-16/9 sm:aspect-21/9 min-h-[220px] sm:min-h-[380px] md:min-h-[480px] w-full flex items-center justify-center bg-black overflow-hidden group">
          
          {images.map((img, index) => (
            <div
              key={img.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img 
                src={resolveUrl(img.url)} 
                alt={img.title || 'Shop Showcase'} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30"></div>
            </div>
          ))}

          {/* Slide Caption Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left text-white">
            <div className="space-y-1 max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-700/50">
                <Sparkles className="w-3 h-3" />
                Storefront Showcase ({currentSlide + 1}/{images.length})
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                {images[currentSlide]?.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                {images[currentSlide]?.caption}
              </p>
            </div>

            {/* Switch Back to Video */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReplayVideo}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <VideoIcon className="w-4 h-4" />
                <span>Play Store Video</span>
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-black/50 backdrop-blur-md">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-6 bg-cyan-400' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              ></button>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
