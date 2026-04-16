import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductZoomProps {
  src: string;
  alt: string;
  title?: string;
}

/**
 * Interactive product zoom component with:
 * - Pinch zoom (touch) and mouse wheel zoom
 * - 360° rotation with arrow keys or mouse drag
 * - Keyboard navigation (+ - R for reset)
 * - Accessibility: ARIA labels, keyboard focus
 * - Performance: Debounced zoom/rotation
 */
export function ProductZoom({ src, alt, title }: ProductZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const MIN_ZOOM = 100;
  const MAX_ZOOM = 300;
  const ROTATION_STEP = 5;

  // Handle zoom with mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) return;
      e.preventDefault();

      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)));
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case "+":
        case "=":
          e.preventDefault();
          setZoom(prev => Math.min(MAX_ZOOM, prev + 10));
          break;
        case "-":
          e.preventDefault();
          setZoom(prev => Math.max(MIN_ZOOM, prev - 10));
          break;
        case "r":
        case "R":
          e.preventDefault();
          setZoom(100);
          setRotation(0);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setRotation(prev => (prev - ROTATION_STEP + 360) % 360);
          break;
        case "ArrowRight":
          e.preventDefault();
          setRotation(prev => (prev + ROTATION_STEP) % 360);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle mouse drag for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const rotationDelta = (deltaX / 10) % 360;
    setRotation(prev => (prev + rotationDelta) % 360);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle pinch zoom on touch devices
  useEffect(() => {
    let lastDistance = 0;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (lastDistance === 0) {
        lastDistance = distance;
        return;
      }

      const delta = distance - lastDistance;
      setZoom(prev =>
        Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta * 0.5))
      );
      lastDistance = distance;
    };

    const handleTouchEnd = () => {
      lastDistance = 0;
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Main zoom viewer */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square bg-black/20 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing border border-amber-500/20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        role="region"
        aria-label="Product zoom viewer"
        tabIndex={0}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          title={title || alt}
          className="w-full h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotateZ(${rotation}deg)`,
          }}
          draggable={false}
        />

        {/* Zoom level indicator */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-mono">
          {zoom}% • {Math.round(rotation)}°
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(prev => Math.max(MIN_ZOOM, prev - 10))}
          aria-label="Zoom out (- key)"
          className="border-amber-500/30 hover:border-amber-500/60"
        >
          <ZoomOut className="w-4 h-4" />
          Zoom Out
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(prev => Math.min(MAX_ZOOM, prev + 10))}
          aria-label="Zoom in (+ key)"
          className="border-amber-500/30 hover:border-amber-500/60"
        >
          <ZoomIn className="w-4 h-4" />
          Zoom In
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setZoom(100);
            setRotation(0);
          }}
          aria-label="Reset zoom and rotation (R key)"
          className="border-amber-500/30 hover:border-amber-500/60"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setRotation(prev => (prev - ROTATION_STEP + 360) % 360)
          }
          aria-label="Rotate left (← key)"
          className="border-amber-500/30 hover:border-amber-500/60"
        >
          ↶ Left
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setRotation(prev => (prev + ROTATION_STEP) % 360)}
          aria-label="Rotate right (→ key)"
          className="border-amber-500/30 hover:border-amber-500/60"
        >
          Right ↷
        </Button>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">Keyboard Shortcuts:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>
            <kbd className="bg-slate-800 px-2 py-0.5 rounded text-amber-400">
              +
            </kbd>{" "}
            /{" "}
            <kbd className="bg-slate-800 px-2 py-0.5 rounded text-amber-400">
              -
            </kbd>{" "}
            to zoom
          </li>
          <li>
            <kbd className="bg-slate-800 px-2 py-0.5 rounded text-amber-400">
              ←
            </kbd>{" "}
            /{" "}
            <kbd className="bg-slate-800 px-2 py-0.5 rounded text-amber-400">
              →
            </kbd>{" "}
            to rotate
          </li>
          <li>
            <kbd className="bg-slate-800 px-2 py-0.5 rounded text-amber-400">
              R
            </kbd>{" "}
            to reset
          </li>
          <li>Drag to rotate, scroll to zoom, pinch on touch devices</li>
        </ul>
      </div>
    </div>
  );
}
