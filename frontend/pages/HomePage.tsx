import { useEffect, useState } from "react";
import type { VolunteerOpportunity } from "../src/types/VolunteerOpportunity";
import { fetchOpportunities } from "../src/services/api";
import { FilterBar } from "../src/components/FilterBar";
import { OpportunityCard } from "../src/components/OpportunitiesCard";

export const HomePage = () => {
  const [opps, setOpps] = useState<VolunteerOpportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOpportunities()
      .then(data => setOpps(data))
      .catch(() => setError("Could not load data."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = opps.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category ? opp.type === category : true)
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Volunteer Opportunities</h1>
      <FilterBar setSearchTerm={setSearchTerm} setCategory={setCategory} />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No opportunities found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
        </div>
      )}
    </div>
  );
};
