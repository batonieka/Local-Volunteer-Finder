import { useParams } from "react-router-dom";
import { useFetch } from "../src/hooks/useFetch";
import { fetchOpportunityById } from "../src/services/api";
import { FaCalendarAlt, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { useCallback, useState } from "react";
import { Modal } from "../src/components/Modal";
import { ApplicationForm } from "../src/components/ApplicationForm";

export const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  // Memoize fetch function to avoid infinite loops
  const fetchFn = useCallback(() => {
    if (!id) return null;
    return fetchOpportunityById(id);
  }, [id]);

  // Use fetchFn with useFetch and pass [fetchFn] as dependency array
  const { data: opportunity, loading, error } = useFetch(fetchFn, [fetchFn]);
   
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  if (loading) return <p className="text-center" role="status">Loading...</p>;
  if (error) return <p className="text-red-500 text-center" role="alert">{error}</p>;
  if (!opportunity) return <p className="text-center">Opportunity not found.</p>;

  // Submit handler for the application form
  const handleApplicationSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      // TODO: Add your submission logic here, e.g., API call
      console.log("Application submitted:", formData);

      alert("Application submitted successfully!");
      setIsModalOpen(false); // close modal after successful submit
    } catch (error) {
      alert("Failed to submit application. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <div className="details-container">
        <div className="details-left">
          <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
          <p className="details-description">{opportunity.description}</p>

          <div className="buttons-container">
            <button 
              className="button-signup"
              onClick={() => setIsModalOpen(true)}  // Open modal on click
            >
              Sign Up for this Opportunity
            </button>
            <button
              onClick={() => {
                const url = window.location.href;
                if (navigator.share) {
                  navigator.share({ title: "Check out this opportunity", url });
                } else {
                  navigator.clipboard.writeText(url);
                  alert("Link copied to clipboard!");
                }
              }}
              className="button-share"
            >
              Share
            </button>
          </div>
        </div>

        <div className="details-right details-info">
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

      {/* Modal for application form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ApplicationForm onSubmit={handleApplicationSubmit} loading={formLoading} />
      </Modal>
    </>
  );
};
