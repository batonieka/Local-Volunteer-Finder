import { useNavigate } from "react-router-dom";
import type { VolunteerOpportunity } from "../types/VolunteerOpportunity";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { FaHeart, FaRegHeart, FaCalendarAlt, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { useCallback } from "react";

export const OpportunityCard = ({ opportunity }: { opportunity: VolunteerOpportunity }) => {
  const [favorites, setFavorites] = useLocalStorage<VolunteerOpportunity[]>("favorites", []);
  const navigate = useNavigate();

  const isSaved = favorites.some(fav => fav.id === opportunity.id);

  const toggleSave = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaved) {
      setFavorites(favorites.filter(fav => fav.id !== opportunity.id));
    } else {
      setFavorites([...favorites, opportunity]);
    }
  }, [isSaved, favorites, opportunity, setFavorites]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button')) {
      navigate(`/opportunity/${opportunity.id}`);
    }
  }, [navigate, opportunity.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/opportunity/${opportunity.id}`);
    }
  }, [navigate, opportunity.id]);

  return (
    <article
      className="relative bg-white bg-opacity-10 border border-white/20 rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer backdrop-blur-md"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${opportunity.title}`}
    >
      {/* Save Button */}
      <button
        onClick={toggleSave}
        className="absolute top-3 right-3 z-10 text-red-500 text-xl bg-white/70 hover:bg-white rounded-full p-2 shadow-sm transition"
        aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
      >
        {isSaved ? <FaHeart /> : <FaRegHeart />}
      </button>

      <h2 className="text-xl font-bold text-white mb-2 pr-8">{opportunity.title}</h2>
      <p className="text-white/80 mb-4 line-clamp-3">{opportunity.description}</p>

      <div className="space-y-2 text-sm text-white/70">
        <div className="flex items-center">
          <span className="mr-2 text-blue-400">
            <FaCalendarAlt />
          </span>
          <span><strong>Date:</strong> {opportunity.date}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-green-400">
            <FaMapMarkerAlt />
          </span>
          <span><strong>Location:</strong> {opportunity.location}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-purple-400">
            <FaTag />
          </span>
          <span><strong>Category:</strong> {opportunity.type}</span>
        </div>
      </div>
    </article>
  );
};
