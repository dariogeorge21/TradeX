"use client";

import { ErrorCard } from "@/components/stocks/ErrorCard";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <ErrorCard
        message="Something went wrong loading this mutual fund."
      />
      <div className="mt-4 flex justify-center">
        <button 
          onClick={() => reset()}
          className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
