import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LuxuryParticleBackground } from "./LuxuryParticleBackground";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.opacity = "0";
      titleRef.current.style.transform = "translateY(40px)";
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.style.transition =
            "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)";
          titleRef.current.style.opacity = "1";
          titleRef.current.style.transform = "translateY(0)";
        }
      }, 100);
    }
    if (subtitleRef.current) {
      subtitleRef.current.style.opacity = "0";
      setTimeout(() => {
        if (subtitleRef.current) {
          subtitleRef.current.style.transition = "opacity 1s ease-out";
          subtitleRef.current.style.opacity = "1";
        }
      }, 300);
    }
    if (ctaRef.current) {
      ctaRef.current.style.opacity = "0";
      ctaRef.current.style.transform = "scale(0.95)";
      setTimeout(() => {
        if (ctaRef.current) {
          ctaRef.current.style.transition =
            "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)";
          ctaRef.current.style.opacity = "1";
          ctaRef.current.style.transform = "scale(1)";
        }
      }, 500);
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background mesh-gradient cinematic-surface section-divider-glow"
    >
      <LuxuryParticleBackground className="absolute inset-0 opacity-95" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-16 right-1/4 w-96 h-96 bg-amber-500/12 rounded-full blur-3xl" />
        <div className="absolute bottom-16 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl">
        <div className="flex justify-center">
          <div className="px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              Est. 1994 • Dhaka Heritage
            </span>
          </div>
        </div>

        <h1
          ref={titleRef}
          className="text-fluid-hero font-black text-white tracking-widest leading-tight text-glow-amber"
        >
          MARJAHAN'S
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-slate-300 font-light tracking-wide max-w-2xl mx-auto"
        >
          Where <span className="text-amber-400 font-semibold">LUXURY</span>{" "}
          meets{" "}
          <span className="text-amber-400 font-semibold">AFFORDABILITY</span>
        </p>

        <p className="text-sm text-slate-400 tracking-widest uppercase max-w-xl mx-auto leading-relaxed">
          Discover our curated collection of exquisite jewelry, handcrafted with
          precision and passion.
        </p>

        <div ref={ctaRef} className="pt-8">
          <Button
            size="lg"
            onClick={() => setLocation("/products")}
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-300 text-black rounded-full px-12 py-6 uppercase tracking-widest font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_24px_80px_rgba(251,191,36,0.22)]"
          >
            Explore Collection
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
