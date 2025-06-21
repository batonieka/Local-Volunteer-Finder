type FilterBarProps = {
  searchTerm: string;
  category: string;
  setSearchTerm: (term: string) => void;
  setCategory: (category: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  categoryOptions: string[];
};


export const FilterBar = ({
  searchTerm,
  category,
  setSearchTerm,
  setCategory,
  sortOrder,
  setSortOrder,
  categoryOptions
}: FilterBarProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1.5rem",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.5rem",
        padding: "1rem",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Search Input */}
      <div className="relative" style={{ minWidth: "250px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search opportunities..."
          aria-label="Search opportunities"
          style={{
            width: "100%",
            padding: "0.75rem 2.5rem 0.75rem 1rem",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "inherit",
            fontSize: "1rem",
          }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
              padding: "0.25rem",
            }}
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
  style={{
    minWidth: '180px',
    padding: '0.75rem 1rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'inherit',
    fontSize: '1rem',
  }}
>
  <option value="">All Categories</option>
  {categoryOptions.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>




      {/* Sort Order Dropdown */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        aria-label="Sort opportunities"
        style={{
          minWidth: "200px",
          padding: "0.75rem 1rem",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "6px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          color: "inherit",
          fontSize: "1rem",
        }}
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
