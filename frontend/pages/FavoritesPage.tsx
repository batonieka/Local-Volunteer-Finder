import React from "react";
import { useLocalStorage } from "../src/hooks/useLocalStorage";
import { OpportunityCard } from "../src/components/OpportunitiesCard";
import type { VolunteerOpportunity } from "../src/types/VolunteerOpportunity";

export const FavoritesPage = () => {
const [favorites, setFavorites] = useLocalStorage<VolunteerOpportunity[]>("favorites", []);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  if (!favorites || favorites.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Your Favorites</h1>
        <p className="text-lg text-gray-600 max-w-xl text-center">
          You haven't saved any opportunities yet. Explore and add some favorites!
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">Your Favorites</h1>
      <p className="text-center text-gray-700 mb-8">
        You have {favorites.length} favorite{favorites.length > 1 ? "s" : ""}
      </p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {favorites.map((opportunity) => (
        <div key={opportunity.id} className="relative group">
          <OpportunityCard opportunity={opportunity} />
          <button
            onClick={() => removeFavorite(opportunity.id)}
            className="absolute top-3 left-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Remove ${opportunity.title} from favorites`}
            title="Remove from favorites"
            type="button"
          >
            ×
          </button>
        </div>
        ))}
      </div>

      {favorites.length > 3 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear all favorites?")) {
                setFavorites([]);
              }
            }}
            className="px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-semibold transition"
          >
            Clear All Favorites
          </button>
        </div>
      )}
    </main>
  );
};
