import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type VolunteerOpportunity } from "../src/types/VolunteerOpportunity";
import { fetchOpportunityById } from "../src/services/api";
import { useFetch } from "../src/hooks/useFetch";

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
const { data: opportunity, loading, error } = useFetch<VolunteerOpportunity>(
  `http://localhost:3000/opportunities/${id}`
);


  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!opportunity) return <p className="text-center">Opportunity not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{opportunity.title}</h1>
      <p className="mt-2">{opportunity.description}</p>
      <div className="text-sm text-gray-600 mt-4">
        <p><strong>Date:</strong> {opportunity.date}</p>
        <p><strong>Location:</strong> {opportunity.location}</p>
        <p><strong>Category:</strong> {opportunity.type}</p>
      </div>
    </div>
  );
};
