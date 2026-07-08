# ClimaClick

ClimaClick e una web app meteo moderna, veloce e leggera. Nasce come progetto di sperimentazione con React e TypeScript, con l'obiettivo di offrire una consultazione semplice del meteo, delle previsioni e del radar pioggia senza richiedere API key.

## Funzionalita

- Meteo attuale della localita selezionata.
- Ricerca citta in tempo reale con Open-Meteo Geocoding.
- Geolocalizzazione, quando il browser e il contesto HTTPS la permettono.
- Previsioni orarie delle prossime ore.
- Previsioni giornaliere a 7 giorni con dettaglio apribile.
- Flash meteo generati dai dati reali della previsione.
- Citta preferite salvate nel localStorage.
- Radar pioggia con mappa interattiva e timeline dei frame.
- Tema chiaro/scuro salvato nel localStorage.
- Layout responsive per desktop e mobile.
- Meta tag SEO e Open Graph per la condivisione del sito.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Leaflet e React Leaflet
- Lucide React
- ESLint

## API usate

ClimaClick usa servizi gratuiti e senza API key:

- Open-Meteo Forecast API: dati meteo attuali, orari e giornalieri.
- Open-Meteo Geocoding API: ricerca delle localita.
- RainViewer Weather Maps API: tile radar per la pioggia.

Nota: RainViewer e un servizio gratuito best effort. Le tile radar possono non essere sempre disponibili o complete in tutte le zone.

## Requisiti

Il progetto usa Node indicato in `.nvmrc`:

```bash
24.16.0
```

Se usi nvm:

```bash
nvm use
```

## Installazione

```bash
npm install
```

## Sviluppo

Avvia il server Vite:

```bash
npm run dev
```

Di solito l'app sara disponibile su:

```bash
http://localhost:5173
```

Per provarla da un altro dispositivo nella stessa rete puoi avviare Vite esponendo l'host:

```bash
npm run dev -- --host 0.0.0.0
```

Poi apri dal telefono l'indirizzo IP del PC con la porta indicata da Vite.

## Build e cache

La build di produzione viene generata in `dist`:

```bash
npm run build
```

Vite crea asset con hash nel nome dei file generati. Questo aiuta il browser a caricare la versione nuova quando cambia il codice, ma riguarda la build in `dist`, non i file sorgente in `src`.

Per controllare la build localmente:

```bash
npm run preview
```

## Script disponibili

```bash
npm run dev
```

Avvia il progetto in sviluppo.

```bash
npm run build
```

Compila TypeScript e genera la build di produzione.

```bash
npm run preview
```

Serve localmente la build gia generata.

```bash
npm run lint
```

Esegue ESLint su tutto il progetto.

## Struttura progetto

```text
src/
  components/   Componenti riutilizzabili: meteo, ricerca, radar, ticker e footer
  hooks/        Hook applicativi, come useWeather
  pages/        Pagine principali: Home, dettaglio citta, preferiti, radar
  services/     Integrazione API e localStorage
  styles/       CSS globale dell'app, temi e responsive
  types/        Tipi TypeScript condivisi
public/         Logo, favicon e asset pubblici
```

## Geolocalizzazione

La geolocalizzazione usa le API native del browser. Se viene rifiutata o bloccata, l'app mostra un messaggio e permette comunque di cercare la citta manualmente.

## Radar pioggia

Il radar usa RainViewer e Leaflet. La timeline mostra i frame radar disponibili, con controlli per play/pausa e selezione manuale del frame.

## Tema

Il tema chiaro/scuro viene gestito in React e salvato nel localStorage. Il logo cambia in base al tema per mantenere un buon contrasto nella navbar e nel footer.

## Deploy

Il progetto puo essere pubblicato come classica app Vite statica. In produzione e sufficiente distribuire il contenuto della cartella `dist` generata da `npm run build`.

## Stato progetto

Versione attuale: `1.1.0`.

ClimaClick e pensato come progetto personale di apprendimento e sperimentazione, ma con una base concreta per diventare un piccolo servizio meteo completo.
