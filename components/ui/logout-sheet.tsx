'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOutIcon, Loader2Icon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface LogoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
}

export function LogoutSheet({ isOpen, onClose, onConfirm, isLoggingOut = false }: LogoutSheetProps) {
  // Close sheet after logout starts; the page shows full-screen loader
  useEffect(() => {
    if (isLoggingOut) onClose();
  }, [isLoggingOut, onClose]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="top" className="bg-black/90 text-white border-b border-white/20">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-white">
            <LogOutIcon className="w-5 h-5 text-red-400" />
            Confirm Logout
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3 text-neutral-300">
          <p>Are you sure you want to sign out? Any unsaved changes will be lost.</p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoggingOut}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoggingOut ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Sign Out
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default LogoutSheet;


