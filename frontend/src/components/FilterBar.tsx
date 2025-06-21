interface FilterBarProps {
  searchTerm: string;
  category: string;
  setSearchTerm: (term: string) => void;
  setCategory: (category: string) => void;
}

export const FilterBar = ({
  searchTerm,
  category,
  setSearchTerm,
  setCategory,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full md:w-1/2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded w-full md:w-1/3"
      >
        <option value="">All Categories</option>
        <option value="Environmental">Environmental</option>
        <option value="Education">Education</option>
        <option value="Health">Health</option>
        <option value="Community">Community</option>
      </select>
    </div>
  );
};
