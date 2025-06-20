// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DetailsPage } from './pages/DetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/opportunity/:id" element={<DetailsPage />} />
    </Routes>
  );
}

export default App;
