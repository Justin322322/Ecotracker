type ToastBusPayload = {
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
};

const EVENT_NAME = 'app:toast';

export function dispatchToast(payload: ToastBusPayload): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }));
}

export function listenToast(handler: (payload: ToastBusPayload) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<ToastBusPayload>).detail;
    handler(detail);
  };
  window.addEventListener(EVENT_NAME, listener as EventListener);
  return () => window.removeEventListener(EVENT_NAME, listener as EventListener);
}


