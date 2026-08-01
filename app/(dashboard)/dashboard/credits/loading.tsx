import { Skeleton } from "@/components/ui/skeleton";

export default function CreditsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-6 w-20" />
      </div>
      <Skeleton className="h-24" />
      <Skeleton className="h-48" />
    </div>
  );
}