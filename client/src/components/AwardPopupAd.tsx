import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AwardPopupAdProps {
  onClose?: () => void;
}

const AwardPopupAd: React.FC<AwardPopupAdProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasShownPopup = sessionStorage.getItem('awardPopupShown');
    
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('awardPopupShown', 'true');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative max-w-md mx-4 bg-gradient-to-b from-purple-900 via-blue-900 to-purple-800 rounded-2xl overflow-hidden shadow-2xl animate-popup-enter">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200 group"
          aria-label="Close popup"
        >
          <X className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Header with sparkle effects */}
        <div className="relative px-3 py-2 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 opacity-20 rounded-t-2xl"></div>
          <div className="relative">
            
            <p className="text-yellow-200 pt-4 text-lg font-medium">
              Merit Award Winner - Western Province Entrepreneur Awards 2024
            </p>
          </div>
        </div>

        {/* Award Image */}
        <div className="px-6 pb-4">
          <div className="relative bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
            <img
              src="/client/awards/award-ceremony.webp"
              alt="HarithaWeli Award Ceremony - Merit Award for Indigenous Manufacturing Sector Western Province"
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                // Fallback placeholder if award image doesn't load
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF3YXJkIENlcmVtb255IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
            
            {/* Award Details Overlay */}
            {/* <div className="absolute bottom-6 left-6 right-6 bg-gradient-to-r from-blue-900 to-purple-900 bg-opacity-95 rounded-lg p-4 text-white">
              <h3 className="text-xl font-bold mb-2">🏆 Merit Award Achievement</h3>
              <p className="text-sm leading-relaxed">
                <strong>HarithaWeli</strong> was awarded as the <strong>"Indigenous Manufacturing Sector Western Province"</strong> 
                at the prestigious Western Province Entrepreneur Awards 2024
              </p>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 text-center">
          {/* <p className="text-white font-semibold text-lg mb-2">
            🇱🇰 Sri Lanka's Only Awarded Wall Plaster Company!
          </p> */}
          <p className="text-green-100 text-sm">
            Proudly Made in Sri Lanka | Setting Standards in Construction Excellence
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-yellow-400 animate-bounce">⭐</div>
        <div className="absolute top-32 right-16 text-yellow-300 animate-pulse">✨</div>
        <div className="absolute bottom-32 left-16 text-yellow-400 animate-bounce delay-500">🌟</div>
        <div className="absolute bottom-20 right-20 text-yellow-300 animate-pulse delay-1000">⭐</div>
      </div>
    </div>
  );
};

export default AwardPopupAd;