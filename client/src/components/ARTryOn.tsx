import { Camera, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ARTryOnProps {
  productName?: string;
  productImage?: string;
}

/**
 * AR Try-On Placeholder Component
 * Provides UI for ring try-on feature (functional WebGL version coming soon)
 * Shows:
 * - Camera access prompt
 * - Ring size selector
 * - Placement visualization
 * - Instructions
 */
export function ARTryOn({ productName = 'Ring', productImage }: ARTryOnProps) {
  const [selectedSize, setSelectedSize] = useState('7');
  const [isExpanded, setIsExpanded] = useState(false);

  const ringSizes = [
    { size: '5', label: 'XS (5)' },
    { size: '6', label: 'S (6)' },
    { size: '7', label: 'M (7)' },
    { size: '8', label: 'L (8)' },
    { size: '9', label: 'XL (9)' },
    { size: '10', label: 'XXL (10)' },
  ];

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });

      // Stop the stream for now (full AR implementation coming)
      stream.getTracks().forEach((track) => track.stop());

      alert(
        'Full AR try-on is coming soon! For now, please select your ring size and visualize the fit.'
      );
    } catch (error) {
      console.error('[AR] Camera access denied:', error);
      alert('Camera access is required for AR try-on. Please enable camera permissions.');
    }
  };

  return (
    <div className="space-y-6">
      {/* AR Preview Area */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 border-dashed border-amber-500/30 overflow-hidden flex items-center justify-center">
        {/* Placeholder visualization */}
        <div className="text-center space-y-4">
          <Smartphone className="w-16 h-16 text-amber-400/50 mx-auto" />
          <div>
            <p className="text-slate-300 font-semibold">AR Try-On Preview</p>
            <p className="text-sm text-slate-500">
              Enable camera to see {productName} on your hand
            </p>
          </div>

          {/* Ring size visualization */}
          <div className="mt-8 space-y-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Selected Size</p>
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-amber-400/40 flex items-center justify-center bg-amber-400/10">
                <span className="text-2xl font-bold text-amber-400">{selectedSize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* "Coming Soon" badge */}
        <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/40 rounded-full px-3 py-1">
          <span className="text-xs font-semibold text-amber-300">BETA</span>
        </div>
      </div>

      {/* Size Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-white">
          Select Ring Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ringSizes.map((item) => (
            <button
              key={item.size}
              onClick={() => setSelectedSize(item.size)}
              className={`py-3 px-2 rounded-lg font-semibold transition-all ${
                selectedSize === item.size
                  ? 'bg-amber-500 text-black border-2 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-2 border-slate-700 hover:border-amber-500/50'
              }`}
              aria-pressed={selectedSize === item.size}
              aria-label={`Select size ${item.label}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Not sure your size?{' '}
          <a href="#size-guide" className="text-amber-400 hover:text-amber-300 underline">
            View size guide
          </a>
        </p>
      </div>

      {/* Camera Access Button */}
      <Button
        onClick={handleCameraAccess}
        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6 flex items-center justify-center gap-2"
        size="lg"
      >
        <Camera className="w-5 h-5" />
        Enable Camera for AR Try-On
      </Button>

      {/* Instructions */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-white text-sm">How to Use AR Try-On:</h4>
        <ol className="text-sm text-slate-300 space-y-2">
          <li className="flex gap-3">
            <span className="font-bold text-amber-400 flex-shrink-0">1.</span>
            <span>Select your ring size from the options above</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-amber-400 flex-shrink-0">2.</span>
            <span>Click "Enable Camera" and allow camera access</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-amber-400 flex-shrink-0">3.</span>
            <span>Position your hand in front of the camera</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-amber-400 flex-shrink-0">4.</span>
            <span>See how the ring looks on your finger in real-time</span>
          </li>
        </ol>
      </div>

      {/* Browser Compatibility Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300">
        <p className="font-semibold mb-1">💡 Browser Support</p>
        <p>
          AR Try-On works best on modern browsers (Chrome, Safari, Edge) with camera support.
          Some older browsers may not be compatible.
        </p>
      </div>

      {/* Add to Cart Button */}
      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
        size="lg"
      >
        Add to Cart (Size {selectedSize})
      </Button>
    </div>
  );
}
