import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Modal } from "./Modal";
import { ApplicationForm } from "./ApplicationForm";
import { useState } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleApplicationSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      console.log("Application submitted:", formData);
      alert("Application submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to submit application. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <Header onSubmitClick={() => setIsModalOpen(true)} />
      <main className="mt-16 mb-12">{children}</main>
      <Footer />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ApplicationForm onSubmit={handleApplicationSubmit} loading={formLoading} />
      </Modal>
    </>
  );
};
