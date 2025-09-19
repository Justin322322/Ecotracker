"use client";

import * as React from "react";
import { useState } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";
// Removed PixelBlast to prevent hydration issues

// Hook to handle mobile keyboard adjustments
const useMobileKeyboardAdjustment = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const initialHeight = window.innerHeight;
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      // Consider keyboard open if height difference is more than 150px
      const keyboardOpen = heightDifference > 150;
      setIsKeyboardOpen(keyboardOpen);
      setKeyboardHeight(keyboardOpen ? heightDifference : 0);
    };

    // Listen to visual viewport changes (better for mobile keyboard detection)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport?.removeEventListener('resize', handleResize);
    } else {
      // Fallback to window resize
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return { keyboardHeight, isKeyboardOpen };
};

interface EnhancedDrawerProps {
  children?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  shouldScaleBackground?: boolean;
}

const sideClasses: Record<NonNullable<EnhancedDrawerProps["side"]>, string> = {
  top: "inset-x-0 top-0 h-auto w-full rounded-b-2xl",
  bottom: "inset-x-0 bottom-0 h-auto w-full rounded-t-2xl",
  left: "inset-y-0 left-0 h-full w-[420px] sm:w-[480px] rounded-r-2xl",
  right: "inset-y-0 right-0 h-full w-[420px] sm:w-[480px] rounded-l-2xl",
};

export const EnhancedDrawer = ({ 
  side = "bottom", 
  children, 
  open, 
  onOpenChange, 
  shouldScaleBackground = false,
  ...props 
}: EnhancedDrawerProps) => (
  <DrawerPrimitive.Root
    open={open}
    onOpenChange={onOpenChange}
    shouldScaleBackground={shouldScaleBackground}
    direction={side as "left" | "right" | "top" | "bottom"}
    {...props}
  >
    {children}
  </DrawerPrimitive.Root>
);

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm",
      // Prevent white edges by ensuring full-viewport overlay and dark base
      "[background-color:rgba(0,0,0,0.6)]",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right";
    bottomOffset?: number | string;
    overlayBottomOffset?: number | string;
    contentBottomOffset?: number | string;
    overlayZIndex?: number;
    contentZIndex?: number;
    overlayClassName?: string;
  }
>(({ side = "bottom", className, children, bottomOffset, overlayBottomOffset, contentBottomOffset, overlayZIndex, contentZIndex, overlayClassName, ...props }, ref) => {
  const { keyboardHeight, isKeyboardOpen } = useMobileKeyboardAdjustment();
  const resolvedOverlayBottom = overlayBottomOffset ?? bottomOffset;
  const resolvedContentBottom = contentBottomOffset ?? bottomOffset;
  
  return (
    <DrawerPrimitive.Portal>
      <DrawerOverlay
        className={overlayClassName}
        style={{
          zIndex: overlayZIndex,
          ...(side === "bottom" && resolvedOverlayBottom !== undefined
            ? { bottom: typeof resolvedOverlayBottom === 'number' ? `${resolvedOverlayBottom}px` : resolvedOverlayBottom }
            : {}),
        }}
      />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-[80] bg-neutral-950/95 text-white border border-white/10 p-0 shadow-2xl overflow-hidden",
          "focus:outline-none",
          sideClasses[side],
          // Avoid background scroll without causing layout shift
          "[&[data-state='open']]:[position:fixed]",
          // Mobile optimizations
          side === "bottom" && "touch-pan-y",
          className
        )}
        style={{
          ...(contentZIndex !== undefined ? { zIndex: contentZIndex } : {}),
          // Adjust position when keyboard is open on mobile
          ...(side === "bottom" && isKeyboardOpen && {
            bottom: `${keyboardHeight}px`,
            maxHeight: `calc(100vh - ${keyboardHeight}px)`,
          }),
          ...(side === "top" && isKeyboardOpen && {
            top: `${keyboardHeight}px`,
            maxHeight: `calc(100vh - ${keyboardHeight}px)`,
          }),
          ...(side === "bottom" && resolvedContentBottom !== undefined
            ? { bottom: typeof resolvedContentBottom === 'number' ? `${resolvedContentBottom}px` : resolvedContentBottom }
            : {}),
        }}
        {...props}
      >
        {/* Simple background gradient instead of PixelBlast */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] bg-gradient-to-br from-green-900/20 to-green-600/10" />
        {/* subtle texture overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(60%_40%_at_50%_-10%,black,transparent)] bg-[radial-gradient(600px_240px_at_50%_-10%,rgba(34,197,94,0.6),transparent)]" />
        {/* content wrapper: center vertically for side drawers, normal for top/bottom */}
        <div className={cn(
          "relative z-10 w-full overflow-y-auto",
          side === "right" || side === "left" ? "h-full flex items-center justify-center p-6" : "p-6",
          // Mobile keyboard adjustments
          side === "bottom" && isKeyboardOpen && "pb-safe"
        )}>
          <div className={cn(
          side === "right" || side === "left" ? "w-full max-w-[480px]" : "w-full",
          side === "bottom" && "max-h-[80vh]",
          // Ensure content is visible when keyboard is open
          side === "bottom" && isKeyboardOpen && "max-h-[60vh]"
          )}>
            {children}
          </div>
        </div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
});
DrawerContent.displayName = DrawerPrimitive.Content.displayName;

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 space-y-1", className)} {...props} />
);

export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3", className)} {...props} />
);

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-neutral-300", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;
