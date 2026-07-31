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
        retry={reset}
      />
    </div>
  );
}
