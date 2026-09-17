import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Film, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Play,
  RotateCcw,
  Video,
  FileVideo
} from 'lucide-react';

export default function AdminMediaPage() {
  const { 
    media, 
    updateVideo, 
    uploadHeroVideo, 
    resetHeroVideo, 
    addMediaImage, 
    deleteMediaImage, 
    showToast 
  } = useApp();

  const videoFileInputRef = useRef(null);

  // Video Form State
  const [videoUrl, setVideoUrl] = useState(media?.video?.url || '/final_video.mp4');
  const [videoTitle, setVideoTitle] = useState(media?.video?.title || 'Chhaya Mobiles Workshop & Store Showcase');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState(() => {
    if (media?.video?.isLocalUploaded) {
      return {
        name: media.video.fileName || 'Custom Uploaded Video',
        size: media.video.fileSize || 0
      };
    }
    return null;
  });

  // Image Slider Form State
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newImgTitle, setNewImgTitle] = useState('');
  const [newImgCaption, setNewImgCaption] = useState('');
  const [fileLoading, setFileLoading] = useState(false);

  // Keep in sync with media context if it changes
  React.useEffect(() => {
    if (media?.video?.url) {
      setVideoUrl(media.video.url);
    }
    if (media?.video?.isLocalUploaded) {
      setUploadedVideoInfo({
        name: media.video.fileName || 'Custom Uploaded Video',
        size: media.video.fileSize || 0
      });
    } else {
      setUploadedVideoInfo(null);
    }
  }, [media?.video]);

  // Handle Video File Upload from Local Computer
  const handleLocalVideoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Please select a valid video file (.mp4, .webm, etc.).', 'error');
      return;
    }

    setUploadingVideo(true);
    try {
      const blobUrl = await uploadHeroVideo(file);
      setVideoUrl(blobUrl);
      setUploadedVideoInfo({
        name: file.name,
        size: file.size
      });
      if (!videoTitle || videoTitle === 'Chhaya Mobiles Workshop & Store Showcase') {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingVideo(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  const handleResetToDefaultVideo = async () => {
    if (window.confirm('Reset homepage hero to default workshop video?')) {
      await resetHeroVideo();
      setVideoUrl('/final_video.mp4');
      setUploadedVideoInfo(null);
      setVideoTitle('Chhaya Mobiles Workshop & Store Showcase');
    }
  };

  // Save Video Handler (for manual URL or title edit)
  const handleSaveVideo = (e) => {
    e.preventDefault();
    if (!videoUrl) {
      showToast('Video URL or path is required.', 'error');
      return;
    }
    updateVideo({
      url: videoUrl,
      title: videoTitle,
      isLocalUploaded: !!uploadedVideoInfo,
      fileName: uploadedVideoInfo?.name,
      fileSize: uploadedVideoInfo?.size
    });
    showToast('Hero showcase video settings updated successfully!', 'success');
  };

  // File Upload to Data URL Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }

    setFileLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewImgUrl(event.target?.result);
      if (!newImgTitle) setNewImgTitle(file.name.replace(/\.[^/.]+$/, ''));
      setFileLoading(false);
      showToast('Image file loaded into preview!', 'info');
    };
    reader.readAsDataURL(file);
  };

  // Add Image Handler
  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newImgUrl) {
      showToast('Please provide an image URL or upload a file.', 'error');
      return;
    }

    addMediaImage({
      url: newImgUrl,
      title: newImgTitle || 'Showcase Image',
      caption: newImgCaption || 'Sony Dharmshala Chitrakoot Workshop'
    });

    setNewImgUrl('');
    setNewImgTitle('');
    setNewImgCaption('');
  };

  const handleDeleteImage = (id, title) => {
    if (window.confirm(`Delete "${title}" from the homepage gallery?`)) {
      deleteMediaImage(id);
    }
  };

  const images = media?.images || [];

  return (
    <div className="space-y-8 text-left max-w-5xl pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
              Storefront Media CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Showcase Video &amp; Image Gallery Manager
          </h1>
          <p className="text-xs text-slate-500">
            Manage the hero autoplay video and the automatic image slider displayed on the customer homepage.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs flex items-center gap-1.5"
        >
          <ExternalLink className="w-4 h-4 text-blue-600" />
          <span>View Live Hero</span>
        </a>
      </div>

      {/* ─── 1. HERO VIDEO MANAGER ─── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-blue-700">
            <Film className="w-5 h-5" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Homepage Autoplay Video</h3>
              <p className="text-xs text-slate-500">This video autoplays when customers open the homepage</p>
            </div>
          </div>
          {uploadedVideoInfo && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Local Video Active ({uploadedVideoInfo.size ? `${(uploadedVideoInfo.size / (1024 * 1024)).toFixed(1)} MB` : 'Custom File'})</span>
            </span>
          )}
        </div>

        {/* Local Computer Video Upload Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all flex flex-col items-center justify-center text-center gap-3">
          <input 
            type="file" 
            ref={videoFileInputRef} 
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*" 
            onChange={handleLocalVideoSelect} 
            className="hidden" 
          />
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
            <FileVideo className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-extrabold text-slate-900">Upload Video from Local Computer</h4>
            <p className="text-xs text-slate-500">Select any MP4 or WebM video file from your computer to feature on the homepage</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              disabled={uploadingVideo}
              onClick={() => videoFileInputRef.current?.click()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{uploadingVideo ? 'Storing Video...' : 'Choose Video File from Computer'}</span>
            </button>
            {uploadedVideoInfo && (
              <button
                type="button"
                onClick={handleResetToDefaultVideo}
                className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to Default Video</span>
              </button>
            )}
          </div>
          <span className="text-[10px] text-slate-400">
            Stored directly in browser IndexedDB memory for fast playback • Supports full HD 1080p MP4 &amp; WebM
          </span>
        </div>

        {/* Video Details & Direct Path Input */}
        <form onSubmit={handleSaveVideo} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Active Video Source Path or Direct URL
              </label>
              <input 
                type="text"
                required
                value={videoUrl.startsWith('blob:') ? `[Local Computer File: ${uploadedVideoInfo?.name || 'Selected Video'}]` : videoUrl}
                onChange={e => {
                  if (!videoUrl.startsWith('blob:')) {
                    setVideoUrl(e.target.value);
                  }
                }}
                readOnly={videoUrl.startsWith('blob:')}
                placeholder="e.g. /final_video.mp4 or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {videoUrl.startsWith('blob:') 
                  ? 'Currently playing uploaded file from local computer storage.' 
                  : 'Default assets video is /final_video.mp4.'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Video Overlay Title
              </label>
              <input 
                type="text"
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
                placeholder="e.g. Chhaya Mobiles Workshop Tour"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Video Title &amp; Config</span>
            </button>

            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Storefront Autoplay Sync Active
            </span>
          </div>
        </form>

        {/* Video Preview */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">Live Video Stream Preview:</span>
            {uploadedVideoInfo && (
              <span className="text-[11px] text-blue-600 font-semibold">{uploadedVideoInfo.name}</span>
            )}
          </div>
          <div className="w-full max-w-xl aspect-16/9 rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-inner">
            <video 
              key={videoUrl}
              src={videoUrl} 
              controls 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ─── 2. IMAGE SLIDER GALLERY MANAGER ─── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-cyan-700">
          <ImageIcon className="w-5 h-5" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Post-Video Image Slider ({images.length} Images)</h3>
            <p className="text-xs text-slate-500">
              When the video completes, the website automatically transitions to this interactive image carousel.
            </p>
          </div>
        </div>

        {/* Add New Image Form */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            + Add New Image to Showcase
          </span>

          <form onSubmit={handleAddImage} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL / Path</label>
                <input 
                  type="text" 
                  value={newImgUrl}
                  onChange={e => setNewImgUrl(e.target.value)}
                  placeholder="e.g. /exterior.png or https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Or Upload from Computer</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image Title</label>
                <input 
                  type="text" 
                  value={newImgTitle}
                  onChange={e => setNewImgTitle(e.target.value)}
                  placeholder="e.g. Front Glass Showcase"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Caption / Description</label>
                <input 
                  type="text" 
                  value={newImgCaption}
                  onChange={e => setNewImgCaption(e.target.value)}
                  placeholder="e.g. Sony Dharmshala Showroom View"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Image to Gallery</span>
            </button>
          </form>
        </div>

        {/* Existing Images Grid */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-slate-700 block">Current Gallery Slides:</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div 
                key={img.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:shadow-md transition-all"
              >
                <div className="aspect-16/10 relative overflow-hidden bg-slate-200">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleDeleteImage(img.id, img.title)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{img.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
