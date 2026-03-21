export function SkeletonCard() {
  return (
    <div className="card p-4 md:p-6 flex flex-col h-full pointer-events-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="skeleton h-6 w-24 rounded-full"></div>
        <div className="skeleton h-4 w-16"></div>
      </div>
      
      {/* Title */}
      <div className="skeleton h-5 w-3/4 mb-2"></div>
      <div className="skeleton h-5 w-1/2 mb-4"></div>
      
      {/* Description */}
      <div className="skeleton h-4 w-full mb-1 flex-grow"></div>
      <div className="skeleton h-4 w-full mb-1"></div>
      <div className="skeleton h-4 w-4/5 mb-6"></div>
      
      {/* Metadata */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
      
      {/* Footer */}
      <div className="pt-3 border-t border-default flex justify-between items-center">
        <div className="skeleton h-6 w-32 rounded-full"></div>
        <div className="skeleton h-4 w-4 rounded-full"></div>
      </div>
    </div>
  );
}
