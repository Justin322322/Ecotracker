'use client';

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { useDashboardSummary } from "@/hooks/use-carbon-data"
import { useEffect, useMemo, useRef, useState } from "react"

export function SectionCards() {
  const { data: summary, isLoading, error } = useDashboardSummary();
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Update active dot based on nearest slide while scrolling (robust across gaps/snap)
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;
    let raf = 0;

    const update = () => {
      const left = root.scrollLeft;
      let nearestIndex = 0;
      let nearestDist = Number.POSITIVE_INFINITY;
      for (let i = 0; i < slideRefs.current.length; i++) {
        const el = slideRefs.current[i];
        if (!el) continue;
        const dist = Math.abs(left - el.offsetLeft);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIndex = i;
        }
      }
      setActiveIndex(nearestIndex);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    // Initial compute and listeners
    update();
    root.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToSlide = (index: number) => {
    const root = trackRef.current;
    const target = slideRefs.current[index];
    if (!root || !target) return;
    root.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  };

  // Prepare slides unconditionally so hook order stays stable across renders
  const slides = useMemo(() => [
    (
      <Card key="slide-0" className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Monthly CO₂ Emissions</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {summary?.totalEmissions?.toFixed(1) || '2.8'} tons
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3 text-green-600" />
              {summary?.monthlyReduction || '-15.2'}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reduced this month <TrendingDownIcon className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Great progress towards your goal
          </div>
        </CardFooter>
      </Card>
    ),
    (
      <Card key="slide-1" className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Transportation Emissions</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            1.2 tons
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3 text-green-600" />
              -8.3%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Improved efficiency <TrendingDownIcon className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Less driving, more public transport
          </div>
        </CardFooter>
      </Card>
    ),
    (
      <Card key="slide-2" className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Home Energy Usage</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            890 kWh
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3 text-green-600" />
              -5.1%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Energy efficient upgrades <TrendingDownIcon className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">LED bulbs making a difference</div>
        </CardFooter>
      </Card>
    ),
    (
      <Card key="slide-3" className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Carbon Offset Progress</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            73%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3 text-green-600" />
              +23%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            On track to carbon neutral <TrendingUpIcon className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">27% remaining to reach goal</div>
        </CardFooter>
      </Card>
    ),
  ], [summary?.monthlyReduction, summary?.totalEmissions]);

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 gap-y-6 px-4 lg:px-6 mb-4 md:mb-6">
        {Array.from({ length: 4 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 gap-y-6 px-4 lg:px-6 mb-4 md:mb-6">
        <Card className="@container/card col-span-full">
          <CardHeader>
            <CardTitle className="text-destructive">Error loading data</CardTitle>
            <CardDescription>Please try refreshing the page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Mobile carousel */}
      <div className="md:hidden px-4 lg:px-6 mb-4">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto gap-4" 
          role="listbox"
          aria-label="Stats carousel"
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              ref={(el: HTMLDivElement | null) => {
                slideRefs.current[i] = el;
              }}
              className="snap-start shrink-0 basis-full"
              role="option"
              aria-selected={activeIndex === i}
            >
              {slide}
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToSlide(i)}
              className={
                "h-1.5 w-1.5 rounded-full transition-colors " +
                (activeIndex === i ? "bg-green-400" : "bg-neutral-600")
              }
            />
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid-cols-1 gap-4 gap-y-6 px-4 lg:px-6 mb-4 md:mb-6">
        {slides}
      </div>
    </>
  )
}
