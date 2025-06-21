import { useParams } from "react-router-dom";
import { useFetch } from "../src/hooks/useFetch";
import { fetchOpportunityById } from "../src/services/api";
import { FaCalendarAlt, FaMapMarkerAlt, FaTag } from "react-icons/fa";

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: opportunity, loading, error } = useFetch(() => fetchOpportunityById(id!));

  if (loading) return <p className="text-center" role="status">Loading...</p>;
  if (error) return <p className="text-red-500 text-center" role="alert">{error}</p>;
  if (!opportunity) return <p className="text-center">Opportunity not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-6 bg-white rounded shadow">
      <div>
        <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
        <p className="text-gray-700 mb-6">{opportunity.description}</p>
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
          Sign Up for this Opportunity
        </button>
      </div>
      <div className="space-y-4 text-sm text-gray-600">
        <p>
  <span className="inline mr-2 text-blue-600"><FaCalendarAlt /></span>
  <strong>Date:</strong> {opportunity.date}
</p>
<p>
  <span className="inline mr-2 text-blue-600"><FaMapMarkerAlt /></span>
  <strong>Location:</strong> {opportunity.location}
</p>
<p>
  <span className="inline mr-2 text-blue-600"><FaTag /></span>
  <strong>Category:</strong> {opportunity.type}
</p>

       </div>
    </div>
  );
};
