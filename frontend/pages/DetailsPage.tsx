// src/pages/DetailsPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { VolunteerOpportunity } from '../types';
import { fetchOpportunityById } from '../services/api';

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchOpportunityById(id)
        .then(setOpportunity)
        .catch(() => setError("Could not load opportunity."))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!opportunity) return <p>Opportunity not found.</p>;

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
