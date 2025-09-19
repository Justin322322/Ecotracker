"use client";

import { Button } from '@/components/ui/button';
// Removed unused Card imports since we're using the new FeaturesSection component
import { Separator } from '@/components/ui/separator';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import dynamic from 'next/dynamic';
const PixelBlast = dynamic(() => import('@/components/PixelBlast'), {
  ssr: false,
  loading: () => null,
});

// Lazy load heavy components
const WorldMapLite = dynamic(() => import('@/components/ui/world-map-lite'), {
  loading: () => null,
  ssr: false
});

const FeaturesSection = dynamic(() => import('@/components/ui/features-section'), {
  loading: () => null
});

// PixelBlast is statically imported above for instant render

const GradualBlur = dynamic(() => import('@/components/GradualBlur'), {
  loading: () => null,
  ssr: false
});
import {
  EnhancedDrawer as Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/enhanced-drawer';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import SignUpForm from '@/components/forms/SignUpForm';
import SignInForm from '@/components/forms/SignInForm';

function StepsCarousel() {
  type Step = { num: number; title: string; desc: string };
  const steps: ReadonlyArray<Step> = [
    {
      num: 1,
      title: 'Connect Your Data',
      desc:
        'Link your transportation, energy, and lifestyle data sources for automatic tracking.',
    },
    {
      num: 2,
      title: 'Get Insights',
      desc:
        'Receive personalized insights and recommendations based on your unique footprint.',
    },
    {
      num: 3,
      title: 'Take Action',
      desc:
        'Implement suggested changes and track your progress towards carbon neutrality.',
    },
  ] as const;

  const [current, setCurrent] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const next = () => setCurrent((c) => (c + 1) % steps.length);

  // Autoplay with perfect loop
  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % steps.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, [isPaused, steps.length]);

  // Pause when carousel is not visible
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first) return;
        setIsPaused(!first.isIntersecting);
      },
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  const activeIndex: number = steps.length === 0 ? 0 : current % steps.length;
  const active: Step = (steps[activeIndex] ?? steps[0]) as Step;

  return (
    <div ref={containerRef} className="mx-auto max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl">
      <div
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-8 md:p-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-live="polite"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_40%_at_50%_0%,black,transparent)] bg-[radial-gradient(600px_240px_at_50%_-10%,rgba(34,197,94,0.12),transparent)]" />

        <div key={activeIndex} className="relative grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4 md:gap-8 items-center animate-fade-slide-up">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{active.num}</span>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 sm:mb-3 text-white">{active.title}</h3>
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              {active.desc}
            </p>
          </div>
        </div>

        <div className="relative mt-6 sm:mt-8 md:mt-10 flex items-center justify-between">
          <div className="flex gap-1.5 sm:gap-2">
            {steps.map((s, idx) => (
              <span
                key={s.num}
                aria-label={`Step ${s.num}`}
                className={`h-1.5 sm:h-2 w-6 sm:w-8 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-green-500' : 'bg-white/15'}`}
              />
            ))}
          </div>

          <Button
            onClick={next}
            size="lg"
            className="green-train-hover px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full border-0 hover:from-green-600 hover:to-green-700 transition-all duration-300"
          >
            Next
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [showPixelBlast, setShowPixelBlast] = useState(false);

  // Defer heavy background mount to avoid visible re-init/flicker on refresh
  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setShowPixelBlast(true));
    });
    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

  // Page-level toasts remain for global messages if needed
  function closeThenOpen(from: 'signin' | 'signup', to: 'signin' | 'signup') {
    const closeSel = from === 'signin' ? '[data-close-signin]' : '[data-close-signup]';
    const openSel = to === 'signin' ? '[data-open-sign-in]' : '[data-open-get-started]';
    (document.querySelector(closeSel) as HTMLButtonElement | null)?.click();
    window.setTimeout(() => {
      (document.querySelector(openSel) as HTMLButtonElement | null)?.click();
    }, 320);
  }

  // Mobile sheet handlers
  function handleMobileSwitchToSignUp() {
    setIsMobileSignInOpen(false);
    setTimeout(() => setIsMobileSignUpOpen(true), 150);
  }

  function handleMobileSwitchToSignIn() {
    setIsMobileSignUpOpen(false);
    setTimeout(() => setIsMobileSignInOpen(true), 150);
  }
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "How it Works",
      link: "#how-it-works",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSignInOpen, setIsMobileSignInOpen] = useState(false);
  const [isMobileSignUpOpen, setIsMobileSignUpOpen] = useState(false);


  return (
    <Toast.Provider swipeDirection="right">
    <main className="relative" style={{ position: 'relative' }}>
      {/* Resizable Navigation */}
      <Navbar>
        {/* Sticky blur behind navbar across the whole page */}
        <GradualBlur
          target="page"
          position="top"
          height="7rem"
          strength={1}
          divCount={5}
          curve="bezier"
          exponential={true}
          opacity={1}
          zIndex={-70}
          className="pointer-events-none"
        />
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            <Drawer side="right">
              <DrawerTrigger asChild>
                <NavbarButton 
                  variant="secondary" 
                  className="green-train-hover px-6 py-2.5 text-sm font-medium bg-transparent border border-white/20 text-white transition-all duration-300 rounded-full backdrop-blur-sm hover:translate-y-0"
                  data-open-sign-in
                >
                  Sign In
                </NavbarButton>
              </DrawerTrigger>
              <DrawerContent side="right" overlayZIndex={90} contentZIndex={95}>
                <div className="relative w-full">
                  <div className="relative rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-xl p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_30px_120px_rgba(0,0,0,0.55)]">
                    <div className="absolute inset-0 rounded-2xl bg-cover bg-center opacity-30" style={{ backgroundImage: `url('/assets/bg.png')` }} />
                    <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-25 bg-[linear-gradient(180deg,rgba(34,197,94,0.25),transparent)]" />
                    <div className="relative z-10">
                      <DrawerHeader>
                        <DrawerTitle>Sign in to EcoTracker</DrawerTitle>
                        <DrawerDescription>
                          Access your dashboard and track your footprint.
                        </DrawerDescription>
                      </DrawerHeader>
                      <SignInForm onSwitchToSignUp={() => closeThenOpen('signin', 'signup')} />
                      <DrawerClose data-close-signin className="hidden" />
                      <DrawerFooter />
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
            <Drawer side="right">
              <DrawerTrigger asChild>
                <NavbarButton 
                  variant="primary" 
                  className="green-train-hover px-8 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white transition-all duration-300 rounded-full border-0 hover:translate-y-0"
                  data-open-get-started
                >
                  Get Started
                </NavbarButton>
              </DrawerTrigger>
              <DrawerContent side="right" overlayZIndex={90} contentZIndex={95}>
                <div className="relative w-full">
                  <div className="relative rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-xl p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_30px_120px_rgba(0,0,0,0.55)]">
                    <div className="absolute inset-0 rounded-2xl bg-cover bg-center opacity-30" style={{ backgroundImage: `url('/assets/bg.png')` }} />
                    <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-25 bg-[linear-gradient(180deg,rgba(34,197,94,0.25),transparent)]" />
                    <div className="relative z-10">
                      <DrawerHeader>
                        <DrawerTitle>Get Started</DrawerTitle>
                        <DrawerDescription>
                          Create an account to begin tracking your emissions.
                        </DrawerDescription>
                      </DrawerHeader>
                       <SignUpForm onSwitchToSignIn={() => closeThenOpen('signup', 'signin')} />
                       <DrawerClose data-close-signup className="hidden" />
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-white/90 hover:text-white transition-colors"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <Separator className="bg-white/20 my-2" />
            <div className="flex w-full flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileSignInOpen(true);
                }}
                className="green-train-hover w-full px-6 py-3 text-sm font-medium bg-transparent border border-white/20 text-white transition-all duration-300 rounded-full backdrop-blur-sm hover:translate-y-0"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileSignUpOpen(true);
                }}
                className="green-train-hover w-full px-8 py-3 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white transition-all duration-300 rounded-full border-0 hover:translate-y-0"
              >
                Get Started
              </button>
            </div>
          </MobileNavMenu>
        </MobileNav>

        {/* Mobile Drawers - Outside of MobileNavMenu to avoid z-index issues */}
        <Drawer side="bottom" open={isMobileSignInOpen} onOpenChange={setIsMobileSignInOpen}>
          <DrawerContent side="bottom" overlayBottomOffset={"calc(env(safe-area-inset-bottom) + 4px)"} contentBottomOffset={4} overlayZIndex={20} contentZIndex={30}>
            <div className="relative rounded-t-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-xl p-5 pb-8 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_20px_80px_rgba(0,0,0,0.55)]">
              <div className="absolute inset-0 rounded-t-2xl bg-cover bg-center opacity-30" style={{ backgroundImage: `url('/assets/bg.png')` }} />
              <div className="pointer-events-none absolute -inset-px rounded-t-2xl opacity-20 bg-[linear-gradient(180deg,rgba(34,197,94,0.25),transparent)]" />
              <div className="relative z-10">
                <DrawerHeader>
                  <DrawerTitle>Sign in to EcoTracker</DrawerTitle>
                  <DrawerDescription>Access your dashboard and track your footprint.</DrawerDescription>
                </DrawerHeader>
                <SignInForm 
                  onSwitchToSignUp={handleMobileSwitchToSignUp}
                  onClose={() => setIsMobileSignInOpen(false)}
                />
                <DrawerFooter />
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        <Drawer side="bottom" open={isMobileSignUpOpen} onOpenChange={setIsMobileSignUpOpen}>
          <DrawerContent side="bottom" overlayBottomOffset={"calc(env(safe-area-inset-bottom) + 4px)"} contentBottomOffset={4} overlayZIndex={20} contentZIndex={30}>
            <div className="relative rounded-t-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-xl p-5 pb-8 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_20px_80px_rgba(0,0,0,0.55)]">
              <div className="absolute inset-0 rounded-t-2xl bg-cover bg-center opacity-30" style={{ backgroundImage: `url('/assets/bg.png')` }} />
              <div className="pointer-events-none absolute -inset-px rounded-t-2xl opacity-20 bg-[linear-gradient(180deg,rgba(34,197,94,0.25),transparent)]" />
              <div className="relative z-10">
                <DrawerHeader>
                  <DrawerTitle>Get Started</DrawerTitle>
                  <DrawerDescription>Create an account to begin tracking your emissions.</DrawerDescription>
                </DrawerHeader>
                <SignUpForm 
                  onSwitchToSignIn={handleMobileSwitchToSignIn}
                  onClose={() => setIsMobileSignUpOpen(false)}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </Navbar>

      {/* Hero Section */}
      <section className="relative lg:sticky top-0 z-0 min-h-[100svh] sm:min-h-screen flex items-center justify-center px-3 sm:px-4 overflow-hidden bg-black -mt-16 sm:-mt-20 pt-16 sm:pt-20">
        {/* PixelBlast background with light blur backdrop */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          {showPixelBlast ? (
            <PixelBlast
              key="hero-pixelblast"
              variant="square"
              pixelSize={6}
              color="#22c55e"
              patternScale={3}
              patternDensity={1.2}
              pixelSizeJitter={0.5}
              enableRipples
              rippleSpeed={0.3}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.3}
              edgeFade={0.25}
              transparent
              className="w-full h-full"
            />
          ) : null}
        </div>
        
        {/* Light blur backdrop for better text readability */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col items-center justify-center min-h-[calc(100svh-5rem)] sm:min-h-[60vh] py-20 sm:py-24 text-center">
            {/* Headline */}
            <div className="space-y-5 sm:space-y-6 text-center">
              <h1 className="hero-text-shadow text-[clamp(3.5rem,15vw,5rem)] leading-[1.05] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-thin tracking-tight text-white text-center">
                <span className="block">ECO</span>
                <span className="block">TRACKER</span>
              </h1>

              {/* Tagline */}
              <p className="text-green-400 text-[clamp(1.1rem,5.5vw,1.75rem)] sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl font-extralight mt-1.5 sm:mt-2 text-center">
                carbon tracker app
              </p>

              {/* Description */}
              <p className="text-[clamp(1rem,4vw,1.125rem)] sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-[40rem] sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light text-center">
                A passionate CS student from <span className="font-semibold text-green-400">BPSU</span>, dedicated to creating innovative solutions for environmental sustainability and carbon footprint tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-optimized transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-48 bg-gradient-to-b from-transparent via-black/25 to-black/70 backdrop-blur-[0.5px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-b from-transparent via-black/35 to-black/60 backdrop-blur-[1px] pointer-events-none" />
      </section>


      {/* Features Section (glass card + background) */}
      <section id="features" className="relative z-10 py-24 sm:py-28 md:py-32 px-0 sm:px-4 scroll-mt-20">
        {/* Background image layer */}
        <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url('/assets/bg.png')`}} />
        {/* Soft dark overlay */}
        <div className="absolute inset-0 -z-10 bg-black/65" />
        {/* Vignette effect on sides */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        {/* Ultra gradual blur transition from Hero section */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/25 via-black/12 to-transparent backdrop-blur-[1.5px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 via-black/18 to-transparent backdrop-blur-[1px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/40 via-black/25 to-transparent backdrop-blur-[0.5px] pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-0 sm:px-4">
          {/* Feature surface - full-bleed on mobile, centered constrained on larger screens */}
          <div className="w-full bg-white/6 backdrop-blur-lg border border-white/10 shadow-xl rounded-none sm:rounded-2xl pt-8 sm:pt-6 md:pt-8 lg:pt-10 pb-0 sm:pb-6 md:pb-8 lg:pb-10 px-0 sm:px-6 md:px-8 lg:px-10">
            <div className="mb-20 sm:mb-16 md:mb-20 lg:mb-24 px-8 sm:px-0 max-w-3xl md:max-w-4xl">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="mb-6 text-base sm:text-xs text-green-400 uppercase tracking-wider font-medium">
              Features
            </div>
                <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 sm:mb-4">
                  Everything you need to go carbon neutral
                </h2>
                <p className="text-xl sm:text-base md:text-lg text-neutral-200 sm:text-neutral-300 font-light leading-relaxed max-w-2xl sm:max-w-none">
                  Our comprehensive platform provides all the tools and insights you need to understand and reduce your environmental impact.
                </p>
              </div>
            </div>

            <FeaturesSection />
          </div>
        </div>

        {/* Ultra gradual blur transition to How It Works section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/12 via-black/30 to-black/50 backdrop-blur-[0.5px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-black/20 to-black/45 backdrop-blur-[1px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-black/25 to-black/40 backdrop-blur-[1.5px] pointer-events-none" />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 sm:py-28 md:py-32 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="mb-3 text-xs text-green-400 uppercase tracking-wider font-medium">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Start reducing your carbon footprint in 3 simple steps
            </h2>
          </div>

          {/* Interactive step card */}
          <StepsCarousel />
        </div>

        {/* Ultra gradual blur transition to Global Impact section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/18 via-black/35 to-black/60 backdrop-blur-[0.5px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-black/25 to-black/55 backdrop-blur-[1px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-black/30 to-black/50 backdrop-blur-[1.5px] pointer-events-none" />
      </section>

      {/* Global Impact Section with World Map */}
      <section className="relative z-10 py-20 sm:py-28 md:py-32 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="mb-3 text-xs text-green-400 uppercase tracking-wider font-medium">
              Global Impact
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 sm:mb-6">
              Join thousands of individuals and organizations worldwide
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
              Already using EcoTracker to reduce their environmental impact and create a sustainable future.
            </p>
            {/* Removed CTA buttons per request */}
          </div>

          {/* Embedded world map without card wrapper */}
          <div className="w-full max-w-[1800px] mx-auto px-0">
            <WorldMapLite
              className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-none mx-[-16px] sm:mx-0"
            />
          </div>
        </div>

        {/* Ultra gradual blur transition to Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-black/12 via-black/25 to-black/50 backdrop-blur-[0.5px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-black/18 via-black/30 to-black/45 backdrop-blur-[1px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent via-black/20 to-black/40 backdrop-blur-[1.5px] pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 sm:py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            <div>
              <h3 className="font-semibold mb-4 text-white text-lg">Connect</h3>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300">Twitter</Button>
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300">LinkedIn</Button>
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300">GitHub</Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white text-lg">Product</h3>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Mobile Apps</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white text-lg">Company</h3>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white text-lg">Support</h3>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Status</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />

          <div className="flex flex-col md:flex-row justify-between items-center text-neutral-400">
            <p className="font-light">&copy; 2025 EcoTracker. All rights reserved.</p>
            <p className="mt-4 md:mt-0 font-light">Built with 💚 for the planet</p>
          </div>
        </div>
      </footer>
    </main>
    </Toast.Provider>
  );
}
