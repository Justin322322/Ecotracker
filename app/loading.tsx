import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="space-y-6 w-full max-w-md px-4">
        <div className="text-center">
          <LoadingSkeleton className="h-12 w-48 mx-auto mb-4" />
          <LoadingSkeleton className="h-4 w-32 mx-auto" />
        </div>
        <div className="space-y-4">
          <LoadingSkeleton className="h-16 w-full" />
          <LoadingSkeleton className="h-16 w-full" />
          <LoadingSkeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}
