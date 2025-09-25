"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastProvider } from '@/components/common/Toast';
import { dispatchToast } from '@/components/common/toast-bus';
import { useUser } from '@/contexts/UserContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface SignUpFormProps {
  buttonClassName?: string;
  fullWidth?: boolean;
  onSwitchToSignIn?: () => void;
  onClose?: () => void;
}

function SignUpForm({ buttonClassName, fullWidth, onSwitchToSignIn, onClose }: SignUpFormProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const router = useRouter();
  const { setUser } = useUser();

  async function handleRegister() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as unknown));
        const msg = (data as { error?: string }).error ?? 'Registration failed';
      dispatchToast({ title: 'Registration failed', description: msg, variant: 'error' });
        return;
      }
      
      // Get user data from response
      const userData = await res.json().catch(() => ({} as unknown));
      const user = userData as { name?: string; email?: string; id?: string };
      
      // Set user in context
      if (user.name && user.email) {
        setUser({
          name: user.name,
          email: user.email,
          id: user.id
        });
      }

      // Clear form
      setName('');
      setEmail('');
      setPassword('');

      // Show success message
      dispatchToast({
        title: 'Account created successfully!',
        description: 'Welcome! You are now logged in.',
        variant: 'success'
      });

      // Small delay to show success message before navigation
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch {
      dispatchToast({ title: 'Network error', description: 'Please try again later.', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <ToastProvider>
        <div className="relative space-y-4 mt-2">
        <div className="relative">
          <input 
            id="signup-name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="peer w-full rounded-md bg-white/5 border border-white/15 px-3 py-3 text-white placeholder-transparent outline-none ring-1 ring-transparent focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-shadow" 
            placeholder="Full name" 
            type="text"
            autoComplete="name"
          />
          <label htmlFor="signup-name" className="pointer-events-none absolute left-3 top-3 text-sm text-neutral-800 transition-all bg-white px-1.5 rounded-md shadow-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-green-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs">
            Full name
          </label>
        </div>
        <div className="relative">
          <input 
            id="signup-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="peer w-full rounded-md bg-white/5 border border-white/15 px-3 py-3 text-white placeholder-transparent outline-none ring-1 ring-transparent focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-shadow" 
            placeholder="Email" 
            type="email"
            autoComplete="email"
            inputMode="email"
          />
          <label htmlFor="signup-email" className="pointer-events-none absolute left-3 top-3 text-sm text-neutral-800 transition-all bg-white px-1.5 rounded-md shadow-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs">
            Email
          </label>
        </div>
        <div className="relative">
          <input 
            id="signup-password" 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="peer w-full rounded-md bg-white/5 border border-white/15 px-3 py-3 pr-10 text-white placeholder-transparent outline-none ring-1 ring-transparent focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm transition-shadow" 
            placeholder="Password" 
            autoComplete="new-password"
          />
          <label htmlFor="signup-password" className="pointer-events-none absolute left-3 top-3 text-sm text-neutral-800 transition-all bg-white px-1.5 rounded-md shadow-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs">
            Password
          </label>
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-2 my-auto inline-flex items-center justify-center h-8 w-8 text-white/80 hover:text-white focus:outline-none focus-visible:outline-none transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className={`mt-4 ${fullWidth ? 'w-full' : ''}`}>
        <button
          type="button"
          onClick={handleRegister}
          disabled={isSubmitting || !name || !email || !password}
          aria-busy={isSubmitting}
          className={buttonClassName ?? 'green-train-hover bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-full border-0'}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating…
            </span>
          ) : (
            'Create Account'
          )}
        </button>
        <div className="mt-3 text-sm text-neutral-300">
          Already have an account?
          <button type="button" onClick={onSwitchToSignIn} className="ml-2 text-green-400 hover:text-green-300 underline underline-offset-4">
            Sign in
          </button>
        </div>
      </div>
      </ToastProvider>
    </>
  );
}

export default SignUpForm;


