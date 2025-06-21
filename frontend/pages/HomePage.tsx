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


// Reducer Setup
type FilterState = { searchTerm: string; category: string };
type FilterAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "RESET_FILTERS" };

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "RESET_FILTERS":
      return { searchTerm: "", category: "" }
    default:
      return state;
  }
};


export const HomePage = () => {
  // Filter state
  const [state, dispatch] = useReducer(filterReducer, {
    searchTerm: "",
    category: "",
  });

  const debouncedSearchTerm = useDebounce(state.searchTerm, 300);

  // Fetch opportunities
  const { data: opps = [], loading, error } = useFetch(fetchOpportunities);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [sortOrder, setSortOrder] = useState("");

  // Filtering with useMemo
  const filtered = useMemo(() => {
  let result = (opps ?? []).filter(
    (opp: { title: string; type: string; }) =>
      opp.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
      (state.category ? opp.type === state.category : true)
  );

  switch (sortOrder) {
    case "date-desc":
      result.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case "date-asc":
      result.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    case "title-asc":
      result.sort((a: { title: string; }, b: { title: any; }) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      result.sort((a: { title: any; }, b: { title: string; }) => b.title.localeCompare(a.title));
      break;
  }

  return result;
}, [opps, debouncedSearchTerm, state.category, sortOrder]);


  useEffect(() => {
  setCurrentPage(1);
}, [state.searchTerm, state.category, sortOrder]);


  // Pagination with useMemo
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <main role="main" className={styles.container}>
      <h1 className={styles.heading}>Volunteer Opportunities</h1>

      {/* FilterBar */}
      <FilterBar
        searchTerm={state.searchTerm}
        category={state.category}
        setSearchTerm={(term) => dispatch({ type: "SET_SEARCH_TERM", payload: term })}
        setCategory={(category) => dispatch({ type: "SET_CATEGORY", payload: category })} sortOrder={""} setSortOrder={function (order: string): void {
          throw new Error("Function not implemented.");
        } }      />

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
    ...
  </div>
) : error ? (
  <p className="text-red-500 text-center" role="alert">
    Oops! Something went wrong. Please try refreshing the page.
  </p>
) : filtered.length === 0 ? (
  <p className="text-center text-gray-500">
    {state.searchTerm || state.category
      ? "No opportunities match your current filters. Try adjusting your search."
      : "No volunteer opportunities available at the moment."}
  </p>
) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {paginated.map((opp: VolunteerOpportunity) => (
              <li key={opp.id}>
                <OpportunityCard opportunity={opp} />
              </li>
            ))}
          </ul>



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