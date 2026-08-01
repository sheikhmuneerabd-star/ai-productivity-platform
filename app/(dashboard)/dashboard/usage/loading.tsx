import { Skeleton } from "@/components/ui/skeleton";

export default function UsageLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-6 w-16" />
      </div>
      <Skeleton className="h-16" />
      <Skeleton className="h-40" />
    </div>
  );
}