export const OpportunityCardSkeleton = () => {
  return (
    <div className="bg-gray-200 animate-pulse p-4 rounded-lg">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );
};
