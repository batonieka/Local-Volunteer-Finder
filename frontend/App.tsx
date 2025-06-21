import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { DetailsPage } from "./pages/DetailsPage";
import { SavedPage } from "./pages/SavedPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Layout } from "./src/components/Layout";
import { FavoritesPage } from "./pages/FavoritesPage";
import { SubmitPage } from "./pages/SubmitPage";



function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/opportunity/:id" element={<DetailsPage />} />
        <Route path="/saved" element={<SavedPage />} /> 
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/submit" element={<SubmitPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
