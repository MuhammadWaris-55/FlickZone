export default function VideoCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border">
      <div className="aspect-video shimmer" />
      <div className="p-3 flex gap-3">
        <div className="w-9 h-9 rounded-full shimmer shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 rounded shimmer w-full" />
          <div className="h-3 rounded shimmer w-2/3" />
          <div className="h-2.5 rounded shimmer w-1/2" />
        </div>
      </div>
    </div>
  );
}
