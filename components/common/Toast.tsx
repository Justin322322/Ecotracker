"use client";

import * as Toast from '@radix-ui/react-toast';
import { X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';
type ToastPosition = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';

interface AppToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: ToastVariant;
  inline?: boolean;
  className?: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
    </Toast.Provider>
  );
}

export function AppToast({ open, onOpenChange, title, description, variant = 'info', inline = false, className }: AppToastProps) {
  const base = 'z-[100] rounded-md text-white shadow-lg border p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0';
  const theme =
    variant === 'success'
      ? 'bg-emerald-600/95 border-emerald-400/50'
      : variant === 'error'
      ? 'bg-red-600/95 border-red-400/50'
      : 'bg-neutral-900 border-white/10';
  const positionCls = inline ? 'absolute -top-6 left-6 right-6 w-auto rounded-xl' : 'fixed w-[calc(100vw-2rem)] sm:w-[320px]';
  const style = inline ? undefined : { right: '1rem', top: '1rem' } as React.CSSProperties;
  return (
    <Toast.Root open={open} onOpenChange={onOpenChange} className={`${base} ${theme} ${positionCls} ${className ?? ''}`} style={style}>
      <Toast.Title className="font-semibold">{title}</Toast.Title>
      {description ? (
        <Toast.Description className="mt-1 text-sm text-neutral-200">{description}</Toast.Description>
      ) : null}
      <Toast.Close aria-label="Close" className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-white/80 hover:text-white focus:outline-none">
        <X className="h-4 w-4" />
      </Toast.Close>
    </Toast.Root>
  );
}

export function ToastViewport({ position = 'top-right' }: { position?: ToastPosition }) {
  const common = 'fixed flex flex-col p-4 sm:p-6 gap-2 w-[calc(100vw-2rem)] sm:w-[390px] max-w-[100vw] m-0 list-none z-[100] outline-none';
  const cls =
    position === 'top-right'
      ? 'top-4 right-4 sm:top-6 sm:right-6'
      : position === 'bottom-right'
      ? 'bottom-4 right-4 sm:bottom-6 sm:right-6'
      : position === 'top-left'
      ? 'top-4 left-4 sm:top-6 sm:left-6'
      : 'bottom-4 left-4 sm:bottom-6 sm:left-6';
  return <Toast.Viewport className={`${common} ${cls}`} />;
}


