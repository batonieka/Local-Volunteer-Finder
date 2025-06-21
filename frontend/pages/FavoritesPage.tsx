import React from "react";
import { useLocalStorage } from "../src/hooks/useLocalStorage";
import type { VolunteerOpportunity } from "../src/types/VolunteerOpportunity";
import { OpportunityCard } from "../src/components/OpportunitiesCard";

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useLocalStorage<VolunteerOpportunity[]>("favorites", []);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  if (favorites.length === 0) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Favorites</h1>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center p-8 bg-white rounded-lg shadow-md border max-w-md">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-4">
              Start exploring opportunities and click the heart icon to save your favorites!
            </p>
            <div className="text-sm text-gray-400">
              Your saved opportunities will appear here
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Favorites</h1>

      <ul
        id="favorites-list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          listStyle: "none",
          padding: "2rem",
          margin: 0,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {favorites.map((opportunity) => (
          <li
            key={opportunity.id}
            style={{
              listStyle: "none",
              padding: "1rem",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
              position: "relative", // needed for absolute remove button if any
            }}
          >
            <OpportunityCard opportunity={opportunity} />

          </li>
        ))}
      </ul>
    </div>
  );
};
