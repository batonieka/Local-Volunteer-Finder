type FilterBarProps = {
  searchTerm: string;
  category: string;
  setSearchTerm: (term: string) => void;
  setCategory: (category: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
};
export const FilterBar = ({
  searchTerm,
  category,
  setSearchTerm,
  setCategory,
  sortOrder,
  setSortOrder,
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
      {/* Search Input */}
      <div className="relative">
  <input
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search..."
  aria-label="Search opportunities"
  className="border px-2 py-1 rounded"
/>
  {searchTerm && (
    <button
      type="button"
      onClick={() => setSearchTerm("")}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
      aria-label="Clear search"
    >
      ×
    </button>
  )}
</div>


      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter by category"
        className="border px-2 py-1 rounded"
      >
        <option value="">All Categories</option>
        <option value="Environment">Environment</option>
        <option value="Health">Health</option>
        <option value="Education">Education</option>
        {/* Add more categories as needed */}
      </select>

      {/* ✅ Sort Order Dropdown */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        aria-label="Sort opportunities"
        className="border px-2 py-1 rounded"
      >
        <option value="">Sort by</option>
        <option value="date-desc">Date: Newest First</option>
        <option value="date-asc">Date: Oldest First</option>
        <option value="title-asc">Title: A-Z</option>
        <option value="title-desc">Title: Z-A</option>
      </select>
    </div>
  );
};
