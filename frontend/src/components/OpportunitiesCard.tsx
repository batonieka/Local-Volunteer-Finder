import { Link } from "react-router-dom";
import type { VolunteerOpportunity } from "../types/VolunteerOpportunity";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export const OpportunityCard = ({ opportunity }: { opportunity: VolunteerOpportunity }) => {
  const [saved, setSaved] = useLocalStorage<string[]>("saved", []);
  const isSaved = saved.includes(opportunity.id);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking the icon
    if (isSaved) {
      setSaved(saved.filter((id) => id !== opportunity.id));
    } else {
      setSaved([...saved, opportunity.id]);
    }
  };

  return (
    <Link to={`/opportunity/${opportunity.id}`} tabIndex={0} role="link" className="block relative">
      <article className="bg-white shadow-md p-4 rounded-lg border hover:shadow-lg transition relative">
        {/* Save Button Top-Right */}
        <button
          onClick={toggleSave}
          className="absolute top-2 right-2 text-red-500 text-lg"
          aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
        >
          {isSaved ? <FaHeart /> : <FaRegHeart />}
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-1">{opportunity.title}</h2>
        <p className="text-gray-600">{opportunity.description}</p>
        <div className="text-sm text-gray-500 mt-3">
          <p><strong>Date:</strong> {opportunity.date}</p>
          <p><strong>Location:</strong> {opportunity.location}</p>
          <p><strong>Category:</strong> {opportunity.type}</p>
        </div>
      </article>
    </Link>
  );
};
