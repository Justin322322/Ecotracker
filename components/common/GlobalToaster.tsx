"use client";

import { useEffect, useState } from 'react';
import { AppToast, ToastProvider, ToastViewport } from '@/components/common/Toast';
import { listenToast } from '@/components/common/toast-bus';

export default function GlobalToaster() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState<string | undefined>('');
  const [variant, setVariant] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    return listenToast((p) => {
      setTitle(p.title);
      setDesc(p.description);
      setVariant(p.variant ?? 'info');
      setOpen(true);
    });
  }, []);

  return (
    <ToastProvider>
      <AppToast open={open} onOpenChange={setOpen} title={title} description={desc} variant={variant} />
      <ToastViewport position="top-right" />
    </ToastProvider>
  );
}


