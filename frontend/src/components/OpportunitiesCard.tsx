import type { VolunteerOpportunity } from "../types/VolunteerOpportunity";

export const OpportunityCard = ({ opportunity }: { opportunity: VolunteerOpportunity }) => {
    return (
        <div className="bg-white shadow-md p-4 rounded-lg border hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800">{opportunity.title}</h2>
            <p className="text-gray-600 mt-1">{opportunity.description}</p>
            <div className="text-sm text-gray-500 mt-2">
                <p><strong>Date:</strong> {opportunity.date}</p>
                <p><strong>Location:</strong> {opportunity.location}</p>
                <p><strong>Category:</strong> {opportunity.type}</p>
            </div>
        </div>
    );
};
