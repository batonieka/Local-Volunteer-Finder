import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { DetailsPage } from "./pages/DetailsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Layout } from "./src/components/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/opportunity/:id" element={<DetailsPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* ✅ 404 route */}
      </Routes>
    </Layout>
  );
}

export default App;
