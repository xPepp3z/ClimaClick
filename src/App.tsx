import { useState } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Heart, Radar, Search } from "lucide-react";
import Home from "./pages/Home";
import CityWeather from "./pages/CityWeather";
import Favorites from "./pages/Favorites";
import RadarPage from "./pages/RadarPage";
import InstallPrompt from "./components/InstallPrompt";
import SiteFooter from "./components/SiteFooter";

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hideFooter = location.pathname === "/radar" || location.pathname === "/favorites";

  function handleSearchToggle() {
    if (location.pathname !== "/") {
      navigate("/");
      setSearchOpen(true);
      return;
    }

    setSearchOpen((isOpen) => !isOpen);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label="ClimaClick home">
          <img
            className="brand-logo"
            src="/ClimaClick Logo Orizzontale Chiaro PNG.png"
            alt="ClimaClick"
          />
        </NavLink>

        <nav className="nav-links" aria-label="Navigazione principale">
          <button
            className={location.pathname === "/" && searchOpen ? "active" : ""}
            type="button"
            onClick={handleSearchToggle}
          >
            <Search size={18} />
            Cerca
          </button>
          <NavLink to="/favorites">
            <Heart size={18} />
            Preferite
          </NavLink>
          <NavLink to="/radar">
            <Radar size={18} />
            Radar
          </NavLink>
        </nav>

        <InstallPrompt />
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home searchOpen={searchOpen} onSearchOpenChange={setSearchOpen} />}
          />
          <Route path="/city/:latitude/:longitude" element={<CityWeather />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/radar" element={<RadarPage />} />
        </Routes>
      </main>

      {!hideFooter && <SiteFooter />}
    </div>
  );
}