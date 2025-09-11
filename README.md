# SunCalc - Solarpotential für Dächer berechnen

Eine interaktive Webanwendung zur Berechnung des Solarpotentials für Dächer mit React Frontend und Node.js Backend.

## Schnellstart

### Systemweite Abhängigkeiten

**Node.js** (Version 18 oder höher)
```bash
# macOS (mit Homebrew)
brew install node

# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Windows
# Download von https://nodejs.org/
```

**Git** (für Repository-Klonen)
```bash
# macOS (mit Homebrew)
brew install git

# Ubuntu/Debian
sudo apt install git

# Windows
# Download von https://git-scm.com/
```

### Lokale Abhängigkeiten installieren

1. **Repository klonen:**
```bash
git clone https://github.com/eKlerner04/suncalc-webapp.git
cd suncalc-webapp

git clone https://gitlab.gwdg.de/e.klerner/suncalc-webapp.git
cd suncalc-webapp
```

2. **Backend-Abhängigkeiten installieren:**
```bash
cd backend
npm install
```

3. **Frontend-Abhängigkeiten installieren:**
```bash
cd ../frontend
npm install
```

## Entwicklung

### 1. Backend starten
```bash
cd backend
npm start
```
Das Backend läuft auf `http://localhost:3000`

### 2. Frontend starten
```bash
cd frontend
npm run dev
```
Das Frontend läuft auf `http://localhost:5173`

### 3. Pocketbase starten
```bash
cd backend
./pb/pocketbase serve --http="127.0.0.1:8090" --dir="./pb_data"
```
Pocketbase läuft auf `http://127.0.0.1:8090`

## Background-Jobs testen

Die verschiedenen Background-Jobs können manuell getestet werden:

cd backend und dann einen der Background-Jobs testen.

### 1. Pre-Fetch (Alle 6 Stunden)
```bash
curl -X POST http://localhost:3000/api/locations/prefetch/run
```

### 2. Score-Degration (Alle 24 Stunden)
```bash
curl -X POST http://localhost:3000/api/locations/decay/run
```

### 3. CleanUp (Alle 6 Stunden)
```bash
curl -X POST http://localhost:3000/api/background-jobs/cleanup
```

## Build

### Backend bauen

```bash
cd backend
npm run build
```

### Frontend bauen

```bash
cd frontend
npm run build
```

## Tastaturnavigation

Die Anwendung ist vollständig per Tastatur bedienbar:

- **Tab:** Durch alle Elemente navigieren
- **Enter/Space:** Elemente aktivieren
- **Pfeiltasten:** Slider bedienen
- **Escape:** Modals schließen

### Tab-Reihenfolge:
1. Suchfeld
2. Berechnen-Button  
3. Breitengrad-Eingabe
4. Längengrad-Eingabe
5. Modulfläche-Eingabe
6. Dachneigung-Slider
7. Dachausrichtung-Kompass
8. Suchergebnisse
9. Karte
10. Suchhistorie

## Projektstruktur

```
suncalc-webapp/
├── frontend/          # React Frontend
│   ├── src/
│   │   ├── components/    # React Komponenten
│   │   └── services/      # API Services
│   └── package.json
├── backend/           # Node.js Backend
│   ├── src/
│   │   ├── routes/       # API Endpunkte
│   │   ├── services/     # Business Logic
│   │   └── utils/        # Utilities
│   └── package.json
└── README.md
```

## Technologien

- **Frontend:** React 19.1.1, Vite 7.1.2, Leaflet.js 1.9.4
- **Backend:** Node.js, Express.js 5.1.0, TypeScript 5.5.4
- **Datenbank:** Pocketbase 0.22.0 (SQLite)
- **APIs:** PVGIS, Nominatim

## Features

- Standort-Ermittlung (Adresse, Karte, Koordinaten)
- Dachparameter-Konfiguration
- Solarpotential-Berechnung
- Interaktive Visualisierungen
- Suchhistorie (LocalStorage)
- Vollständige Tastaturnavigation
- WCAG 2.1 AA Barrierefreiheit
- Responsive Design
