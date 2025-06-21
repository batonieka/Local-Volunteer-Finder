import { useState } from "react";

interface ApplicationFormProps {
  onSubmit: (data: { name: string; email: string; availability: string; message: string }) => void;
  loading: boolean;
}

export const ApplicationForm = ({ onSubmit, loading }: ApplicationFormProps) => {
  const [form, setForm] = useState({ name: "", email: "", availability: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label>
        Name <input name="name" required onChange={handleChange} className="border p-2 w-full rounded" />
      </label>
      <label>
        Email <input name="email" type="email" required onChange={handleChange} className="border p-2 w-full rounded" />
      </label>
      <label>
        Availability <input name="availability" onChange={handleChange} className="border p-2 w-full rounded" />
      </label>
      <label>
        Message <textarea name="message" required onChange={handleChange} className="border p-2 w-full rounded" />
      </label>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded mt-2">
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
};
