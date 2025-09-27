import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'chart' | 'table' | 'text' | 'circle';
  count?: number;
}

function LoadingSkeleton({ 
  className, 
  variant = 'text',
  count = 1 
}: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-muted rounded";
  
  const variants = {
    card: "h-32 w-full",
    chart: "h-[250px] w-full", 
    table: "h-4 w-full mb-2",
    text: "h-4 w-3/4",
    circle: "h-8 w-8 rounded-full",
  };

  const skeletonClass = cn(baseClasses, variants[variant], className);

  if (count === 1) {
    return <div className={skeletonClass} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={skeletonClass} />
      ))}
    </div>
  );
}

// Specific loading components for different sections
export function CardSkeleton() {
  // Height mirrors card content with header + footer spacing
  return (
    <div className="@container/card border rounded-lg p-6 h-[180px]">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <LoadingSkeleton variant="text" className="w-1/3" />
          <LoadingSkeleton variant="text" className="w-16" />
        </div>
        <div>
          <LoadingSkeleton variant="text" className="w-1/2 h-8 mb-4" />
          <LoadingSkeleton variant="text" className="w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="@container/card border rounded-lg p-6">
      <div className="mb-6">
        <LoadingSkeleton variant="text" className="w-1/3 h-6 mb-2" />
        <LoadingSkeleton variant="text" className="w-1/2" />
      </div>
      <LoadingSkeleton variant="chart" />
    </div>
  );
}

// Sidebar skeleton removed (unused)

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table header */}
      <div className="border-b p-4 bg-muted/50">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <LoadingSkeleton key={i} variant="text" className="h-4" />
          ))}
        </div>
      </div>
      
      {/* Table rows */}
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, j) => (
              <LoadingSkeleton key={j} variant="text" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
