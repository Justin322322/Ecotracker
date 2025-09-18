"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useGSAP } from "@/hooks/use-gsap";
import { 
  BarChart3, 
  Calculator, 
  Target, 
  Users, 
  Zap, 
  Shield, 
  Leaf, 
  Globe 
} from "lucide-react";


const isTouchDevice = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const isSmallScreen = () =>
  typeof window !== "undefined" && window.matchMedia('(max-width: 767px)').matches;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement[]>([]);
  const { gsap, gsapLoaded } = useGSAP();

  const features = [
    {
      title: "Real-time Tracking",
      description: "Monitor your carbon footprint in real-time with our advanced tracking algorithms and data analytics.",
      icon: BarChart3,
    },
    {
      title: "Smart Calculations",
      description: "Get accurate carbon footprint calculations using industry-standard methodologies and AI-powered insights.",
      icon: Calculator,
    },
    {
      title: "Goal Setting",
      description: "Set personalized sustainability goals and track your progress with detailed analytics and recommendations.",
      icon: Target,
    },
    {
      title: "Community Impact",
      description: "Join a community of eco-conscious individuals working together to reduce global carbon emissions.",
      icon: Users,
    },
    {
      title: "Instant Insights",
      description: "Get instant insights and recommendations to help you make more sustainable choices in your daily life.",
      icon: Zap,
    },
    {
      title: "Data Security",
      description: "Your data is protected with enterprise-grade security and privacy measures you can trust.",
      icon: Shield,
    },
    {
      title: "Environmental Impact",
      description: "See the real environmental impact of your actions with detailed reports and visualizations.",
      icon: Leaf,
    },
    {
      title: "Sustainable Future",
      description: "Be part of the solution and help create a more sustainable future for generations to come.",
      icon: Globe,
    },
  ];

  useEffect(() => {
    if (!containerRef.current || featuresRef.current.length === 0 || !gsapLoaded || !gsap) return;
    const reduced = prefersReducedMotion();
    const touch = isTouchDevice();
    const small = isSmallScreen();

    const ctx = gsap.context(() => {
      featuresRef.current.forEach((feature, index) => {
        if (reduced) {
          gsap.set(feature, { opacity: 1, y: 0, scale: 1 });
          return;
        }

        // For now, use simple fade-in for all devices to avoid ScrollTrigger issues
        gsap.fromTo(
          feature,
          { opacity: 0, y: 16, scale: 0.99 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.04,
            ease: "power3.out",
          }
        );

        // Hover animations only for non-touch devices
        if (!touch && !small) {
          const hoverElement = feature.querySelector(".feature-hover");
          const iconElement = feature.querySelector(".feature-icon");
          const titleElement = feature.querySelector(".feature-title");
          const barElement = feature.querySelector(".feature-bar");

          if (hoverElement && iconElement && titleElement && barElement) {
            const hoverTl = gsap.timeline({ paused: true });

            hoverTl
              .to(hoverElement, { opacity: 1, duration: 0.22, ease: "power2.out" })
              .to(iconElement, { scale: 1.05, rotation: 0, duration: 0.22, ease: "power2.out" }, 0)
              .to(titleElement, { x: 4, duration: 0.22, ease: "power2.out" }, 0)
              .to(barElement, { height: "1.5rem", backgroundColor: "#22c55e", duration: 0.22, ease: "power2.out" }, 0);

            const onEnter = () => hoverTl.play();
            const onLeave = () => hoverTl.reverse();
            feature.addEventListener("mouseenter", onEnter);
            feature.addEventListener("mouseleave", onLeave);

            // Cleanup listeners
            ctx.add(() => {
              feature.removeEventListener("mouseenter", onEnter);
              feature.removeEventListener("mouseleave", onLeave);
            });
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [gsapLoaded, gsap]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-4 gap-0 relative z-10 py-8 lg:py-8 max-w-[1200px] mx-auto"
    >
      {features.map((feature, index) => (
        <Feature
          key={feature.title}
          {...feature}
          index={index}
          totalFeatures={features.length}
          ref={(el) => {
            if (el) featuresRef.current[index] = el;
          }}
        />
      ))}
    </div>
  );
}

const Feature = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    index: number;
    // totalFeatures left for future use to maintain API; underscore to avoid lint warning
    totalFeatures?: number;
  }
>(({ title, description, icon: Icon, index }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Mobile: Card-like design with proper spacing
        "flex flex-col p-6 lg:p-0 relative group/feature",
        "bg-white/5 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none",
        "border border-white/10 lg:border-0 rounded-xl lg:rounded-none",
        "mx-4 lg:mx-0 mb-4 lg:mb-0",

        // Desktop: Original grid layout
        "lg:flex lg:flex-col lg:border-r lg:py-6 lg:px-6 lg:md:py-10 lg:relative lg:group/feature lg:dark:border-neutral-800/50 lg:transition-all lg:duration-300 lg:hover:bg-neutral-900/50",

        // Desktop border logic (preserved)
        (index === 0 || index === 4) && "lg:border-l lg:dark:border-neutral-800/50",
        index < 4 && "lg:border-b lg:dark:border-neutral-800/50"
      )}
    >
      {/* Mobile: Card background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-xl lg:hidden" />

      {/* Content container */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-4 lg:mb-3 lg:px-0">
          <Icon
            className="feature-icon text-4xl lg:text-2xl text-emerald-500 transition-transform duration-200 group-hover/feature:scale-110"
            aria-hidden
          />
        </div>

        {/* Title */}
        <div className="mb-3 lg:mb-2 lg:px-0 lg:relative">
          {/* Desktop hover bar */}
          <div className="hidden lg:block feature-bar absolute -left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-emerald-500 to-emerald-500/20 transform origin-left scale-x-0 transition-all duration-300 ease-out group-hover/feature:scale-x-100" />
          <h3 className="text-xl lg:text-lg font-semibold text-white transition-all duration-300 lg:pl-4 group-hover/feature:text-emerald-400 leading-tight">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-base lg:text-sm text-neutral-300 lg:text-neutral-400/90 leading-relaxed lg:max-w-[36ch] lg:relative lg:pl-12 transition-colors duration-300 group-hover/feature:text-neutral-300">
          {description}
        </p>
      </div>

      {/* Desktop hover background */}
      <div className="hidden lg:block feature-hover absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-transparent opacity-0 group-hover/feature:opacity-100 transition-all duration-300 ease-out" />
    </div>
  );
});

Feature.displayName = "Feature";
