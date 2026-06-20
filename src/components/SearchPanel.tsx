import { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { searchLocations } from "../services/openMeteo";
import type { FormEvent } from "react";
import type { GeoLocation } from "../types/weather";

type SearchPanelProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelect: (location: GeoLocation) => void;
};

export default function SearchPanel({
  isOpen,
  onOpenChange,
  onSelect,
}: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
      setResults([]);
      setError(null);
      setSubmittedQuery("");
      return;
    }

    if (trimmedQuery.length < 2) {
      setResults([]);
      setError("Scrivi almeno 2 caratteri per cercare una localita.");
      setSubmittedQuery("");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSubmittedQuery(trimmedQuery);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, query]);

  useEffect(() => {
    if (!submittedQuery) return;

    let isActive = true;

    setIsLoading(true);
    setError(null);

    searchLocations(submittedQuery)
      .then((locations) => {
        if (!isActive) return;
        setResults(locations);
        if (locations.length === 0) {
          setError("Nessuna localita trovata. Controlla il nome o prova una citta vicina.");
        }
      })
      .catch((unknownError) => {
        if (!isActive) return;
        setResults([]);
        setError(
          unknownError instanceof Error
            ? unknownError.message
            : "Ricerca non riuscita. Riprova tra poco.",
        );
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [submittedQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setError("Scrivi almeno 2 caratteri per cercare una localita.");
      setSubmittedQuery("");
      return;
    }

    setSubmittedQuery(trimmedQuery);
  }

  function handleClose() {
    onOpenChange(false);
    setQuery("");
    setSubmittedQuery("");
    setResults([]);
    setError(null);
    setIsLoading(false);
  }

  function handleSelect(location: GeoLocation) {
    onSelect(location);
    handleClose();
  }

  function handleCurrentPosition() {
    if (!window.isSecureContext) {
      setError("La posizione richiede HTTPS. Su mobile con indirizzo http://192... il browser la blocca: usa un deploy HTTPS o cerca la citta manualmente.");
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata da questo browser.");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSelect({
          id: Date.now(),
          name: "La tua posizione",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          country: "Locale",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        handleClose();
      },
      (geoError) => {
        setError(getGeolocationMessage(geoError));
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  if (!isOpen) return null;

  return (
    <section className="search-panel is-open" aria-label="Ricerca meteo">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-panel-heading">
          <label htmlFor="city-search">Cerca una citta</label>
        </div>
        <div className="search-row">
          <input
            id="city-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Milano, Tokyo, New York..."
            autoComplete="off"
            autoFocus
          />
          <button type="submit" title="Cerca">
            <Search size={19} />
          </button>
          <button type="button" title="Usa posizione" onClick={handleCurrentPosition}>
            <MapPin size={19} />
          </button>
        </div>
      </form>

      {isLoading && <p className="inline-status">Cerco il cielo giusto...</p>}
      {error && <p className="inline-error">{error}</p>}

      {results.length > 0 && (
        <div className="result-list">
          {results.map((location) => (
            <button
              key={`${location.id}-${location.latitude}`}
              type="button"
              onClick={() => handleSelect(location)}
            >
              <span>{location.name}</span>
              <small>
                {[location.admin1, location.country].filter(Boolean).join(", ")}
              </small>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function getGeolocationMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "Permesso posizione negato. Controlla i permessi del browser o cerca la citta manualmente.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Posizione non disponibile in questo momento. Riprova o cerca una citta.";
  }

  if (error.code === error.TIMEOUT) {
    return "La posizione ci sta mettendo troppo. Riprova o cerca una citta.";
  }

  return "Non riesco a leggere la posizione. Cerca una citta manualmente.";
}