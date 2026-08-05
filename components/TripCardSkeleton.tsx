export default function TripCardSkeleton() {
  return (
    <div className="rounded-2xl bg-panel border border-white/10 overflow-hidden animate-pulse">
      <div className="h-1.5 bg-white/10" />
      <div className="p-6">
        <div className="h-6 w-2/3 bg-white/10 rounded mb-3" />
        <div className="h-3 w-1/2 bg-white/10 rounded mb-6" />
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full bg-white/10 rounded" />
          <div className="h-3 w-5/6 bg-white/10 rounded" />
          <div className="h-3 w-4/6 bg-white/10 rounded" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="h-6 w-16 bg-white/10 rounded" />
          <div className="h-9 w-32 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
