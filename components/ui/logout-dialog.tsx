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
      <DialogContent className="sm:max-w-md bg-black/90 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <LogOutIcon className="w-5 h-5 text-red-400" />
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-neutral-300">
            Are you sure you want to sign out? Any unsaved changes will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
