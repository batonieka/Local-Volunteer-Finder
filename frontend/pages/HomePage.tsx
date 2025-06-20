import { useEffect, useReducer, useState, useMemo, type SetStateAction } from "react";
import { type VolunteerOpportunity } from "../src/types/VolunteerOpportunity";
import { fetchOpportunities } from "../src/services/api";
import { FilterBar } from "../src/components/FilterBar";
import { OpportunityCard } from "../src/components/OpportunitiesCard";

// Reducer and types
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
  const [opps, setOpps] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [state, dispatch] = useReducer(filterReducer, {
    searchTerm: "",
    category: "",
  });

  useEffect(() => {
    fetchOpportunities()
      .then((data: SetStateAction<VolunteerOpportunity[]>) => setOpps(data))
      .catch(() => setError("Could not load data."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return opps.filter(opp =>
      opp.title.toLowerCase().includes(state.searchTerm.toLowerCase()) &&
      (state.category ? opp.type === state.category : true)
    );
  }, [opps, state.searchTerm, state.category]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Volunteer Opportunities</h1>
      <FilterBar
        setSearchTerm={(term: any) => dispatch({ type: "SET_SEARCH_TERM", payload: term })}
        setCategory={(category: any) => dispatch({ type: "SET_CATEGORY", payload: category })}
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No opportunities found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
};
