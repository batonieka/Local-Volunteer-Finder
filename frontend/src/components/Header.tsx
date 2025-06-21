import { NavLink } from "react-router-dom";

export const Header = () => (
  <header className="fixed top-0 left-0 w-full bg-white border-b shadow z-10 p-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">VolunteerHub</h1>
      <nav className="space-x-4">
        <NavLink 
          to="/" 
          className={({ isActive }: { isActive: boolean }) => isActive ? "font-bold" : ""}
        >
          Home
        </NavLink>
        <NavLink to="/submit">Submit</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
      </nav>
    </div>
  </header>
);
