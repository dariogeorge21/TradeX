import { LoadingSkeleton } from "@/components/stocks/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <LoadingSkeleton />
    </div>
  );
}

