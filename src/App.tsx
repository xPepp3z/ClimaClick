import { createContext, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Heart, Moon, Radar, Search, Sun } from "lucide-react";
import Home from "./pages/Home";
import CityWeather from "./pages/CityWeather";
import Favorites from "./pages/Favorites";
import RadarPage from "./pages/RadarPage";
import InstallPrompt from "./components/InstallPrompt";
import SiteFooter from "./components/SiteFooter";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export default function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem("climaclick:theme") === "light" ? "light" : "dark",
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hideFooter = location.pathname === "/radar" || location.pathname === "/favorites";
  const isLightTheme = theme === "light";
  const logoSrc = isLightTheme
    ? "/ClimaClick-logo-orizzontale-scuro.png"
    : "/ClimaClick Logo Orizzontale Chiaro PNG.png";

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  const themeValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme],
  );

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("climaclick:theme", theme);
  }, [theme]);

  function handleSearchToggle() {
    if (location.pathname !== "/") {
      navigate("/");
      setSearchOpen(true);
      return;
    }

    setSearchOpen((isOpen) => !isOpen);
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className="app-shell">
        <header className="topbar">
          <NavLink className="brand" to="/" aria-label="ClimaClick home">
            <img
              className="brand-logo"
              src={logoSrc}
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

          <div className="topbar-actions">
            <button
              className={`theme-toggle ${isLightTheme ? "is-light" : ""}`}
              type="button"
              onClick={toggleTheme}
              title={isLightTheme ? "Attiva tema scuro" : "Attiva tema chiaro"}
              aria-label={isLightTheme ? "Attiva tema scuro" : "Attiva tema chiaro"}
            >
              <span className="theme-toggle-thumb">
                {isLightTheme ? <Moon size={15} /> : <Sun size={15} />}
              </span>
              <span>{isLightTheme ? "Scuro" : "Chiaro"}</span>
            </button>
            <InstallPrompt />
          </div>
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

        {!hideFooter && <SiteFooter logoSrc={logoSrc} />}
      </div>
    </ThemeContext.Provider>
  );
}



