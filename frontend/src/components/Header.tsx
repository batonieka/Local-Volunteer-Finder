import { NavLink } from "react-router-dom";

interface HeaderProps {
  onSubmitClick: () => void;
}

export const Header = ({ onSubmitClick }: HeaderProps) => (
  <header className="fixed top-0 left-0 w-full bg-white border-b shadow z-10 p-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Local Volunteering</h1>
      <nav className="flex gap-6">
        <NavLink 
          to="/" 
          className={({ isActive }: { isActive: boolean }) => isActive ? "font-bold text-blue-600" : ""}
        >
          Home
        </NavLink>

        <NavLink 
          to="/favorites" 
          className={({ isActive }: { isActive: boolean }) => isActive ? "font-bold text-blue-600" : ""}
        >
          Favorites
        </NavLink>

        {/* Changed Submit link to a button */}
        <button
          onClick={onSubmitClick}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          type="button"
        >
          Submit
        </button>
      </nav>
    </div>
  </header>
);
