export default function TicketCardSkeleton() {
  return (
    <div className="rounded-2xl bg-panel border border-white/10 overflow-hidden animate-pulse">
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-16 bg-white/10 rounded" />
          <div className="h-3 w-8 bg-white/10 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-white/10 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-2/3 bg-white/10 rounded" />
          <div className="h-3 w-1/2 bg-white/10 rounded" />
          <div className="h-3 w-1/3 bg-white/10 rounded" />
        </div>
      </div>
      <div className="h-px bg-white/10" />
      <div className="p-5 pt-4 flex items-center justify-between">
        <div className="h-5 w-12 bg-white/10 rounded" />
        <div className="h-5 w-20 bg-white/10 rounded" />
      </div>
    </div>
  );
}
