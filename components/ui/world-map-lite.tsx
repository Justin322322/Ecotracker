"use client";

import { useEffect, useState, useMemo } from "react";
import DottedMap from "dotted-map";
import Image from "next/image";

import { useTheme } from "next-themes";

interface MapProps {
  className?: string;
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
}

export default function WorldMapLite({
  className = "",
}: MapProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // Memoize the map instance
  const map = useMemo(() => new DottedMap({ 
    height: 100, 
    grid: "diagonal"
  }), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the SVG map
  const svgMap = useMemo(() => {
    return map.getSVG({
      radius: 0.28,
      color: theme === "dark" ? "#22C55E80" : "#16A34A99", // Brighter green dots
      shape: "circle",
      backgroundColor: 'black', // force black bg
    });
  }, [map, theme]);

  // Dots processing removed since we're not showing connection lines

  if (!mounted) {
    return (
      <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-500">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-black relative font-sans ${className}`}>
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full pointer-events-none select-none"
        alt="world map"
        height={495}
        width={1056}
        draggable={false}
        priority
        unoptimized
      />
      <svg
        viewBox="200 50 400 300"
        className="w-full h-full absolute inset-0 pointer-events-none select-none mix-blend-screen"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor="#22c55e" stopOpacity="1" />
            <stop offset="95%" stopColor="#22c55e" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dots removed - showing only the base map */}
      </svg>
    </div>
  );
}
