"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface RemoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isRemoving: boolean;
  symbol: string;
}

export function RemoveDialog({
  open,
  onOpenChange,
  onConfirm,
  isRemoving,
  symbol,
}: RemoveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove from Watchlist?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to remove <span className="font-bold text-white">{symbol}</span> from your watchlist? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isRemoving}
            className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
