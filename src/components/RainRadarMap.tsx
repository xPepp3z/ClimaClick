import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { MapPin, Pause, Play, RefreshCw } from "lucide-react";
import { buildRadarTileUrl, getRainViewerTimeline } from "../services/rainViewer";
import type { RainViewerTimeline } from "../services/rainViewer";

const DEFAULT_CENTER: [number, number] = [45.4643, 9.1895];

export default function RainRadarMap() {
  const [timeline, setTimeline] = useState<RainViewerTimeline | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeFrame = timeline?.frames[activeIndex];
  const tileUrl = useMemo(() => {
    if (!timeline || !activeFrame) return null;
    return buildRadarTileUrl(timeline.host, activeFrame);
  }, [activeFrame, timeline]);

  async function loadTimeline() {
    setIsLoading(true);
    setError(null);

    try {
      const nextTimeline = await getRainViewerTimeline();
      setTimeline(nextTimeline);
      setActiveIndex(Math.max(0, nextTimeline.frames.length - 1));
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Radar momentaneamente non disponibile.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTimeline();
  }, []);

  useEffect(() => {
    if (!isPlaying || !timeline?.frames.length) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % timeline.frames.length);
    }, 900);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, timeline]);

  function handleLocate() {
    if (!window.isSecureContext) {
      setError("La posizione richiede HTTPS. Da mobile con IP locale il browser puo bloccarla.");
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata da questo browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
        setError(null);
      },
      () => setError("Non riesco a leggere la posizione. Controlla i permessi del browser."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <section className="radar-panel">
      <div className="section-heading radar-heading">
        <div>
          <h1>Radar pioggia</h1>
          <span>
            {activeFrame
              ? new Intl.DateTimeFormat("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "short",
                }).format(new Date(activeFrame.time * 1000))
              : "Caricamento"}
          </span>
        </div>
        <div className="radar-heading-actions">
          <button type="button" onClick={loadTimeline} title="Aggiorna radar">
            <RefreshCw size={18} />
          </button>
          <button type="button" onClick={handleLocate} title="Centra posizione">
            <MapPin size={18} />
          </button>
        </div>
      </div>

      <div className="radar-map-wrap">
        <MapContainer
          center={center}
          zoom={6}
          minZoom={3}
          maxZoom={7}
          scrollWheelZoom
          className="radar-map"
        >
          <Recenter center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {tileUrl && (
            <TileLayer
              attribution='<a href="https://www.rainviewer.com/">Weather data by RainViewer</a>'
              opacity={1}
              url={tileUrl}
              zIndex={10}
            />
          )}
        </MapContainer>

        {isLoading && <div className="radar-state">Carico radar...</div>}
        {error && <div className="radar-state error-text">{error}</div>}
      </div>

      <div className="radar-controls">
        <button
          type="button"
          onClick={() => setIsPlaying((value) => !value)}
          title={isPlaying ? "Pausa animazione" : "Avvia animazione"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <label className="radar-frame-control">
          <span className="radar-frame-time">
            {activeFrame
              ? new Intl.DateTimeFormat("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(activeFrame.time * 1000))
              : "--:--"}
          </span>
          <input
            type="range"
            min="0"
            max={Math.max(0, (timeline?.frames.length ?? 1) - 1)}
            value={activeIndex}
            onChange={(event) => setActiveIndex(Number(event.target.value))}
            disabled={!timeline?.frames.length}
          />
        </label>
      </div>

      <p className="radar-credit">
        Weather data by{" "}
        <a href="https://www.rainviewer.com/" target="_blank" rel="noreferrer">
          RainViewer
        </a>
      </p>
    </section>
  );
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
}