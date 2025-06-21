import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { DetailsPage } from "./pages/DetailsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/opportunity/:id" element={<DetailsPage />} />
      <Route path="*" element={<NotFoundPage />} /> {/* ✅ 404 route */}
    </Routes>
  );
}

export default App;
