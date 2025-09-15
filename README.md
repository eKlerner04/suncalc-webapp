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
```

2. **Backend-Abhängigkeiten installieren:**
```bash
cd backend
npm install
npm install cors express-rate-limit
npm install --save-dev @types/cors
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
npm run dev
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

### Lokale Tests (Development)
```bash
cd backend
```

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

### Produktions-Tests (Server)
```bash
# Auf dem Server ausführen
curl -sS -X POST https://c110-055.cloud.gwdg.de/api/background-jobs/cleanup
curl -sS -X POST https://c110-055.cloud.gwdg.de/api/locations/prefetch/run
curl -sS -X POST https://c110-055.cloud.gwdg.de/api/locations/decay/run
```

## Sicherheitsfeatures

Die Anwendung implementiert grundlegende Sicherheitsmaßnahmen:

### CORS (Cross-Origin Resource Sharing)
- **Produktion:** Nur `https://c110-055.cloud.gwdg.de` erlaubt
- **Development:** `http://localhost:5173`, `http://127.0.0.1:5173` erlaubt

### Rate Limiting
- **Limit:** 100 Requests pro 15 Minuten pro IP-Adresse
- **Gilt für:** Alle `/api/*` Endpunkte
- **Schutz vor:** Missbrauch und DDoS-Angriffe

### Eingangsvalidierung
- Koordinaten-Validierung
- Parameter-Checks
- Sanitization der Eingabedaten


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

## Deployment auf GWDG-Server

### Server-Setup

1. **Node.js 22.x installieren:**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Caddy installieren:**
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

3. **Pocketbase Systemd-Service erstellen:**
```bash
sudo nano /lib/systemd/system/pocketbase.service
```

Inhalt der Datei:
```ini
[Unit]
Description = pocketbase

[Service]
Type = simple
User = cloud
Group = cloud
LimitNOFILE = 4096
Restart = always
RestartSec = 5s
StandardOutput = append:/home/cloud/pb/std.log
StandardError = append:/home/cloud/pb/std.log
WorkingDirectory = /home/cloud/pb
ExecStart = /home/cloud/pb/pocketbase serve

[Install]
WantedBy = multi-user.target
```

4. **Services aktivieren:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
sudo systemctl enable caddy
sudo systemctl start caddy
```

### Caddy-Konfiguration

Erstelle `/etc/caddy/Caddyfile`:
```caddy
c100-085.cloud.gwdg.de { # Deine Domain
    # Pocketbase auf /pb/*
    handle_path /pb/* {
        reverse_proxy 127.0.0.1:8090
    }
    
    # Backend API auf /api/*
    handle /api/* {
        reverse_proxy 127.0.0.1:3000
    }
    
    # Frontend statische Dateien
    handle {
        root * /srv
        file_server
    }
}
```

5. **Verzeichnisse einrichten:**
```bash
sudo mkdir -p /srv
sudo chown -R caddy:caddy /srv
```

### Deployment-Prozess

1. **Code auf Server kopieren:**
```bash
git clone https://github.com/eKlerner04/suncalc-webapp.git
cd suncalc-webapp
```

2. **Backend bauen und starten:**
```bash
cd backend
npm install
npm install cors express-rate-limit
npm install --save-dev @types/cors
NODE_ENV=production npm run build
# Als Service starten (siehe unten)
```

3. **Frontend bauen:**
```bash
cd frontend
npm install
npm run build  # Setzt automatisch NODE_ENV=production
# dist/ Inhalt nach /srv kopieren
sudo cp -r dist/* /srv/
```

4. **Caddy neu starten:**
```bash
sudo systemctl restart caddy
```

### Backend als Systemd-Service

Erstelle `/lib/systemd/system/suncalc-backend.service`:
```ini
[Unit]
Description = SunCalc Backend

[Service]
Type = simple
User = cloud
Group = cloud
WorkingDirectory = /home/cloud/suncalc-webapp/backend
ExecStart = /usr/bin/node dist/server.js
Restart = always
RestartSec = 5s

[Install]
WantedBy = multi-user.target
```

Aktivieren:
```bash
sudo systemctl daemon-reload
sudo systemctl enable suncalc-backend
sudo systemctl start suncalc-backend
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
│   │   │   ├── SolarCalculator.jsx      # Haupt-Container
│   │   │   ├── LocationInputs.jsx       # Standort-Eingabe
│   │   │   ├── RoofParameters.jsx       # Dachparameter
│   │   │   ├── SolarResults.jsx         # Ergebnisse
│   │   │   ├── SolarDetails.jsx         # Detail-Ansicht
│   │   │   ├── SolarChart.jsx           # Diagramme
│   │   │   ├── MonthlyStats.jsx         # Monatliche Stats
│   │   │   ├── Compass.jsx              # Kompass
│   │   │   ├── LocationMap.jsx          # Karte
│   │   │   ├── SearchHistory.jsx        # Suchhistorie
│   │   │   ├── Header.jsx               # Navigation
│   │   │   ├── Footer.jsx               # Impressum
│   │   │   ├── CalculationInfo.jsx      # Berechnungsinfo
│   │   │   ├── ChartContainer.jsx       # Diagramm-Container
│   │   │   ├── AccessibilityPage.jsx    # Barrierefreiheit
│   │   │   ├── AccessibilityPage.css    # Barrierefreiheit-Styles
│   │   │   ├── PrivacyPage.jsx          # Datenschutz
│   │   │   └── PrivacyPage.css          # Datenschutz-Styles
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
- **Sicherheit:** CORS, Rate Limiting, Input Validation
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
- Datenschutz- und Barrierefreiheits-Seiten
- API-Sicherheit (CORS, Rate Limiting)
