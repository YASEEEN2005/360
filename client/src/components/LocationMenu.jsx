import { useRef, useEffect } from 'react';

export default function LocationMenu({ locations, onSelect, onClose }) {
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div 
        ref={menuRef}
        className="h-full w-full max-w-md bg-slate-900/95 border-l border-white/10 p-6 overflow-y-auto shadow-2xl animate-slide-in"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">All Locations</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid gap-4">
          {locations.map((loc) => (
            <div 
              key={loc.id}
              onClick={() => {
                onSelect(loc.id);
                onClose();
              }}
              className="group cursor-pointer relative overflow-hidden rounded-xl border border-white/5 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Preview */}
              <div className="aspect-video w-full relative">
                 {/* Using the image directly - in a real app might use a smaller thumbnail */}
                <img 
                  src={new URL(`../assets/${loc.image}`, import.meta.url).href} 
                  alt={loc.id}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Text Content */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-lg font-bold text-white mb-1 capitalize group-hover:text-blue-400 transition-colors">
                    {loc.id.replace(/-/g, ' ')}
                  </h3>
                   <div className="flex items-center text-xs text-slate-300 gap-2">
                    <span className="bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        360 View
                    </span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
