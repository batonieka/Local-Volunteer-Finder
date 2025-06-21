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
    <div
      style={{
        marginTop: "2rem",
        marginBottom: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Centered H1 on top */}
      <h1
        style={{
          fontSize: "1.875rem", // 3xl
          fontWeight: "700",
          marginBottom: "1.5rem",
          color: "#ffffff", // gray-800
          textAlign: "center",
        }}
      >
        Your Favorites
      </h1>

      <ul
  id="favorites-list"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", // minimum width 320px per card
    gap: "1.5rem",
    listStyle: "none",
    padding: "2rem",
    margin: 0,
    maxWidth: "1200px",
    width: "100%",
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
    position: "relative",
    width: "320px",
    height: "380px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",  // Distribute space so content and button are separated
  }}
>
  <div>
    <OpportunityCard opportunity={opportunity} />
  </div>

  <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
    <button
      onClick={() => removeFavorite(opportunity.id)}
      className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      aria-label={`Remove ${opportunity.title} from favorites`}
      title="Remove from favorites"
      type="button"
    >
      ×
    </button>
  </div>
</li>

  ))}
</ul>

    </div>
  );
};
