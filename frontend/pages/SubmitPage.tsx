import { useState } from "react";
import { ApplicationForm } from "../src/components/ApplicationForm";

export const SubmitPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      console.log("Application submitted:", formData);
      alert("Application submitted successfully!");
      // Redirect or reset form if needed
    } catch {
      alert("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Submit a New Opportunity</h1>
      <ApplicationForm onSubmit={handleSubmit} loading={loading} />
    </main>
  );
};
