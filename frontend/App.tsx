import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { DetailsPage } from "./pages/DetailsPage";
import { SavedPage } from "./pages/SavedPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Layout } from "./src/components/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/opportunity/:id" element={<DetailsPage />} />
        <Route path="/saved" element={<SavedPage />} /> 
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
