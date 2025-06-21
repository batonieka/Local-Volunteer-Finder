import { useEffect, useReducer, useState, useMemo, type SetStateAction } from "react";
import { type VolunteerOpportunity } from "../src/types/VolunteerOpportunity";
import { fetchOpportunities } from "../src/services/api";
import { FilterBar } from "../src/components/FilterBar";
import { OpportunityCard } from "../src/components/OpportunitiesCard";
import { useDebounce } from "../src/hooks/useDebounce";
import { OpportunityCardSkeleton } from "../src/components/OpportunityCardSkeleton";
import { Pagination } from "../components/Pagination";
import { useFetch } from "../src/hooks/useFetch";

// Reducer
type FilterState = { searchTerm: string; category: string };
type FilterAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_CATEGORY"; payload: string };

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    default:
      return state;
  }
};

export const HomePage = () => {
  const [state, dispatch] = useReducer(filterReducer, {
    searchTerm: "",
    category: "",
  });

  const debouncedSearchTerm = useDebounce(state.searchTerm, 300); // ✅ place here

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

 const { data: opps = [], loading, error } = useFetch<VolunteerOpportunity[]>("http://localhost:3000/opportunities");


  const filtered = useMemo(() => {
    return opps.filter(opp =>
      opp.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
      (state.category ? opp.type === state.category : true)
    );
  }, [opps, debouncedSearchTerm, state.category]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Volunteer Opportunities</h1>
      <FilterBar
        setSearchTerm={(term) => dispatch({ type: "SET_SEARCH_TERM", payload: term })}
        setCategory={(category) => dispatch({ type: "SET_CATEGORY", payload: category })}
      />

      {loading ? (
  <div className="grid gap-4 md:grid-cols-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <OpportunityCardSkeleton key={i} />
    ))}
  </div>
) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No opportunities found.</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {paginated.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filtered.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};
