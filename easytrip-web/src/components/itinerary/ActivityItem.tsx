import React, { useState } from 'react';
import { ActivitySlot } from '../../types/trip';
import { Clock, MapPin, IndianRupee, Lightbulb, Sun, Moon, Sunset, Camera, ImageOff } from 'lucide-react';

export const ActivityItem: React.FC<{ slot: ActivitySlot; period: string }> = ({ slot, period }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const PeriodIcon = period === 'Morning' ? Sun : period === 'Afternoon' ? Sunset : Moon;

  const fallbackUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
  const initialUrl = slot.imageUrl || slot.image || fallbackUrl;
  const [imgSrc, setImgSrc] = useState(initialUrl);

  const handleImageError = () => {
    if (imgSrc !== fallbackUrl) {
      setImgSrc(fallbackUrl);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div className="relative flex flex-col sm:flex-row gap-4 p-4 rounded-md bg-[#141b26] border border-[#222d3d] hover:border-[#f3b740]/40 transition-all duration-300 group specular-sheen">
      {/* Timeline Node Dot */}
      <span className="absolute -left-6 sm:-left-8 top-5 w-3.5 h-3.5 rounded-full bg-[#f3b740] ring-4 ring-[#141b26] border-2 border-[#f3b740] shadow-[0_0_10px_rgba(243,183,64,0.5)] z-10" />

      {/* Image Thumbnail with smooth fade-in and graceful placeholder */}
      <div className="sm:w-44 h-32 rounded-sm overflow-hidden relative shrink-0 border border-[#222d3d] bg-[#101622]">
        {/* Shimmer skeleton while loading */}
        {!imgLoaded && !imgFailed && (
          <div className="absolute inset-0 bg-[#182232] animate-pulse flex items-center justify-center">
            <Camera className="w-5 h-5 text-[#94a3b8]/30" />
          </div>
        )}

        {/* Graceful placeholder if network drops or image fails */}
        {imgFailed ? (
          <div className="w-full h-full bg-[#182232] flex flex-col items-center justify-center p-3 text-center">
            <ImageOff className="w-6 h-6 text-[#f3b740]/60 mb-1" />
            <span className="text-[10px] font-medium text-[#cbd5e1] line-clamp-1">{slot.title}</span>
            <span className="text-[9px] text-[#94a3b8]">Preview offline</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={slot.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={handleImageError}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c]/85 via-transparent to-transparent pointer-events-none" />
        
        {/* Period Badge */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-[#0b0e14]/90 backdrop-blur-md border border-[#f3b740]/30 text-[10px] font-bold text-[#f3b740] flex items-center gap-1">
          <PeriodIcon className="w-3 h-3 text-[#f3b740]" />
          {slot.period}
        </span>

        {/* Unsplash Real Photo Link */}
        {slot.unsplashSearchUrl && (
          <a
            href={slot.unsplashSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`View verified photos of ${slot.photoQuery || slot.title} on Unsplash`}
            className="absolute top-2 right-2 px-1.5 py-0.5 rounded-sm bg-[#0b0e14]/85 hover:bg-[#0b0e14] text-[9px] font-medium text-[#cbd5e1] backdrop-blur-sm flex items-center gap-1 transition-all border border-[#222d3d] hover:border-[#f3b740]/60 z-10"
          >
            <Camera className="w-2.5 h-2.5 text-[#f3b740]" />
            Unsplash
          </a>
        )}

        {/* Category Badge */}
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-sm bg-[#182232]/90 border border-[#222d3d] text-[10px] font-semibold text-[#cbd5e1]">
          {slot.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Time & Cost Header */}
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-1">
            <span className="flex items-center gap-1 font-semibold text-[#f3b740]">
              <Clock className="w-3.5 h-3.5" />
              {slot.time}
            </span>
            {/* Price & Currency Badges: Forest Emerald / Jade Green */}
            <span className="font-bold px-2.5 py-0.5 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/40 flex items-center gap-0.5">
              <IndianRupee className="w-3 h-3" />
              Est. ₹{slot.cost.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base font-bold text-[#f1f5f9] group-hover:text-[#f3b740] transition-colors">
            {slot.title}
          </h4>

          {/* Location */}
          <p className="text-xs text-[#94a3b8] flex items-center gap-1 mt-0.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#f3b740] shrink-0" />
            {slot.location}
          </p>

          {/* Description */}
          <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed">
            {slot.description}
          </p>
        </div>

        {/* Local Tip Box */}
        {slot.tips && (
          <div className="flex items-start gap-2 p-2 rounded-sm bg-[#182232] border border-[#222d3d] text-[11px] text-[#cbd5e1]">
            <Lightbulb className="w-3.5 h-3.5 text-[#f3b740] shrink-0 mt-0.5" />
            <span><strong className="text-[#f3b740]">Insider Tip:</strong> {slot.tips}</span>
          </div>
        )}
      </div>
    </div>
  );
};
