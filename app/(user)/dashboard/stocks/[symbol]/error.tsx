"use client";

import { ErrorCard } from "@/components/stocks/ErrorCard";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-3">
      <ErrorCard message={error.message || "Unexpected error."} backHref="/dashboard/stocks" backLabel="Back to stocks" />
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex text-sm font-medium text-emerald-400 hover:text-emerald-300"
      >
        Retry
      </button>
    </div>
  );
}

