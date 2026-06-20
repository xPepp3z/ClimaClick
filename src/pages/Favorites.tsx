import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import { getFavorites, toggleFavorite } from "../services/favorites";

export default function Favorites() {
  const [favorites, setFavorites] = useState(getFavorites);

  function handleRemove(cityId: number) {
    const city = favorites.find((favorite) => favorite.id === cityId);
    if (!city) return;
    setFavorites(toggleFavorite(city));
  }

  return (
    <div className="page-grid">
      <section className="surface-panel">
        <div className="section-heading">
          <h1>Citta preferite</h1>
          <Heart size={22} />
        </div>

        {favorites.length === 0 ? (
          <p className="muted">Aggiungi una citta dal meteo principale.</p>
        ) : (
          <div className="favorite-list">
            {favorites.map((city) => (
              <article key={city.id}>
                <Link
                  to={`/city/${city.latitude}/${city.longitude}`}
                  state={{ location: city }}
                >
                  <MapPin size={19} />
                  <span>{city.name}</span>
                  <small>{[city.admin1, city.country].filter(Boolean).join(", ")}</small>
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(city.id)}
                  title="Rimuovi dai preferiti"
                >
                  <Heart size={19} fill="currentColor" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
