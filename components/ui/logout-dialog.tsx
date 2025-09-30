'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOutIcon, Loader2Icon } from 'lucide-react';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
}

export function LogoutDialog({ isOpen, onClose, onConfirm, isLoggingOut = false }: LogoutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-sm text-white rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md ring-1 ring-inset ring-white/20 mx-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 opacity-40" />
        </div>
        <DialogHeader className="pb-4">
          <DialogTitle className="text-white flex items-center gap-2 text-lg">
            <LogOutIcon className="w-5 h-5 text-red-400" />
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-neutral-300 text-sm">
            Are you sure you want to sign out? Any unsaved changes will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoggingOut}
            className="bg-transparent border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
