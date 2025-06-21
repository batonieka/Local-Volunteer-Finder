import { Link, useNavigate } from "react-router-dom";
import type { VolunteerOpportunity } from "../types/VolunteerOpportunity";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useCallback } from "react";

export const OpportunityCard = ({ opportunity }: { opportunity: VolunteerOpportunity }) => {
  const [saved, setSaved] = useLocalStorage<string[]>("saved", []);
  const navigate = useNavigate();
  const isSaved = saved.includes(opportunity.id);

  const toggleSave = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    if (isSaved) {
      setSaved(prev => prev.filter((id) => id !== opportunity.id));
    } else {
      setSaved(prev => [...prev, opportunity.id]);
    }
  }, [isSaved, opportunity.id, setSaved]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Only navigate if the click wasn't on the save button
    const target = e.target as HTMLElement;
    if (!target.closest('button')) {
      navigate(`/opportunity/${opportunity.id}`);
    }
  }, [navigate, opportunity.id]);

  return (
    <article 
      className="bg-white shadow-md p-4 rounded-lg border hover:shadow-lg transition relative cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${opportunity.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/opportunity/${opportunity.id}`);
        }
      }}
    >
      {/* Save Button Top-Right */}
      <button
        onClick={toggleSave}
        className="absolute top-2 right-2 text-red-500 text-lg z-10 p-2 hover:bg-gray-100 rounded-full transition"
        aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
        type="button"
      >
        {isSaved ? <FaHeart /> : <FaRegHeart />}
      </button>

      <h2 className="text-xl font-semibold text-gray-800 mb-1 pr-8">{opportunity.title}</h2>
      <p className="text-gray-600 mb-3">{opportunity.description}</p>
      <div className="text-sm text-gray-500 space-y-1">
        <p><strong>Date:</strong> {opportunity.date}</p>
        <p><strong>Location:</strong> {opportunity.location}</p>
        <p><strong>Category:</strong> {opportunity.type}</p>
      </div>
    </article>
  );
};