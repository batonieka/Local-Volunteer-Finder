import { useLocalStorage } from "../src/hooks/useLocalStorage";
import { useFetch } from "../src/hooks/useFetch";
import { VolunteerOpportunity } from "../src/types/VolunteerOpportunity";
import { fetchOpportunities } from "../src/services/api";
import { OpportunityCard } from "../src/components/OpportunitiesCard";

export const SavedPage = () => {
  const [savedIds] = useLocalStorage<string[]>("saved", []);
  const { data: opportunities = [], loading, error } = useFetch(fetchOpportunities);

  const savedOpportunities = opportunities.filter((opp) => savedIds.includes(opp.id));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Opportunities</h1>
      {loading ? (
        <p role="status">Loading saved opportunities...</p>
      ) : error ? (
        <p role="alert">Failed to load opportunities. Try again later.</p>
      ) : savedOpportunities.length === 0 ? (
        <p>No saved opportunities found.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {savedOpportunities.map((opp) => (
            <li key={opp.id}>
              <OpportunityCard opportunity={opp} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
