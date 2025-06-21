import { useEffect, useReducer, useState, useMemo, type SetStateAction } from "react";
import { type VolunteerOpportunity } from "../src/types/VolunteerOpportunity";
import { FilterBar } from "../src/components/FilterBar";
import { OpportunityCard } from "../src/components/OpportunitiesCard";
import { useDebounce } from "../src/hooks/useDebounce";
import { OpportunityCardSkeleton } from "../src/components/OpportunityCardSkeleton";
import { Pagination } from "../src/components/Pagination";
import { useFetch } from "../src/hooks/useFetch";
import styles from "../src/HomePage.module.css";
import { fetchOpportunities } from "../src/services/api";

// Enhanced Reducer Setup to include sortOrder
type FilterState = { 
  searchTerm: string; 
  category: string; 
  sortOrder: string;
};

type FilterAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_SORT_ORDER"; payload: string }
  | { type: "RESET_FILTERS" };

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_SORT_ORDER":
      return { ...state, sortOrder: action.payload };
    case "RESET_FILTERS":
      return { searchTerm: "", category: "", sortOrder: "" };
    default:
      return state;
  }
};

export const HomePage = () => {
  // Filter state with sortOrder included
  const [state, dispatch] = useReducer(filterReducer, {
    searchTerm: "",
    category: "",
    sortOrder: "",
  });

  const debouncedSearchTerm = useDebounce(state.searchTerm, 300);

  // Fetch opportunities
const { data: opps = [] as VolunteerOpportunity[], loading, error } = useFetch(fetchOpportunities);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtering with useMemo
   
  const categoryOptions = useMemo(() => {
  if (!opps) return [];
  const allCategories = opps.map((opp: { type: any; }) => opp.type);
  const unique = Array.from(new Set(allCategories));
  return unique.filter(Boolean);
}, [opps]);



 
  const filtered = useMemo(() => {
  let result = (opps ?? []).filter((opp: { type: string; title: string; }) => {
    const normalizedType = opp.type?.toLowerCase(); // safely normalize
    const selectedCategory = state.category?.toLowerCase();

    const matchesSearch = opp.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? normalizedType === selectedCategory : true;
    const categoryOptions = Array.from(
      new Set(
        (opps as VolunteerOpportunity[]).map((opp) => opp.type).filter(Boolean)
      )   
    );

    return matchesSearch && matchesCategory;
  });
    // Apply sorting based on sortOrder from state
    switch (state.sortOrder) {
    case "date-desc":
      result.sort(
        (a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      break;
    case "date-asc":
      result.sort(
        (a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      break;
    case "title-asc":
      result.sort((a: { title: string; }, b: { title: any; }) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      result.sort((a: { title: any; }, b: { title: string; }) => b.title.localeCompare(a.title));
      break;
    default:
      break;
  }

  return result;
}, [opps, debouncedSearchTerm, state.category, state.sortOrder]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [state.searchTerm, state.category, state.sortOrder]);

  // Pagination with useMemo
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <main role="main" className={styles.container}>
      <h1 className={styles.heading}>Volunteer Opportunities</h1>

      {/* FilterBar with proper sortOrder props */}
      <FilterBar
  searchTerm={state.searchTerm}
  category={state.category}
  setSearchTerm={(term) => dispatch({ type: "SET_SEARCH_TERM", payload: term })}
  setCategory={(category) => dispatch({ type: "SET_CATEGORY", payload: category })}
  sortOrder={state.sortOrder}
  setSortOrder={(order) => dispatch({ type: "SET_SORT_ORDER", payload: order })}
  categoryOptions={categoryOptions}
/>


      <div className="mb-6 text-center">
        <button
          onClick={() => dispatch({ type: "RESET_FILTERS" })}
          className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div role="status" aria-live="polite">
          <p className="sr-only">Loading volunteer opportunities...</p>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <OpportunityCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : error ? (
        <p role="alert" className="text-red-500 text-center">
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          {state.searchTerm || state.category
            ? "No opportunities match your current filters. Try adjusting your search."
            : "No volunteer opportunities found."}
        </p>
      ) : (
        <>

<div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
  <ul
    id="opportunity-list"
    style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      listStyle: 'none', 
      padding: '2rem', 
      margin: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}
  >
    {paginated.map((opp: VolunteerOpportunity) => (
      <li 
        key={opp.id} 
        style={{ 
          listStyle: 'none',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }}
      >
        <OpportunityCard opportunity={opp} />
      </li>
    ))}
  </ul>
</div>

          {/* Pagination */}
           <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filtered.length / itemsPerPage)} 
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </main>
  );
};