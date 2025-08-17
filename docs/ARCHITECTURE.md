# SunCalc WebApp - Architektur & Zusammenarbeit

## Übersicht
Diese Anwendung besteht aus einem **Frontend** (React) und einem **Backend** (Node.js/Express), die über HTTP-APIs kommunizieren.

## Architektur-Diagramm
```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐
│   Frontend      │ ──────────────────► │    Backend      │
│   (React)       │                     │   (Node.js)     │
│   Port: 5173    │                     │   Port: 3000    │
└─────────────────┘                     └─────────────────┘
         ▲                                      │
         │                                      │
         │         JSON Response                │
         └──────────────────────────────────────┘
```

## Komponenten im Detail

### 1. Backend (Node.js + Express)

#### Server (`backend/src/server.ts`)
- **Port:** 3000
- **Funktion:** Hauptserver, der alle API-Routen verwaltet
- **CORS:** Erlaubt Frontend-Zugriff von Port 5173
- **Health-Check:** `/health` Route zum Testen der Server-Verfügbarkeit

#### Solar-Route (`backend/src/routes/solar.ts`)
- **Endpoint:** `GET /api/solar`
- **Parameter:** 
  - `lat`: Breitengrad (z.B. 51.5413 für Göttingen)
  - `lng`: Längengrad (z.B. 9.9158 für Göttingen)
  - `area`: Dachfläche in m² (Standard: 10)
  - `tilt`: Dachneigung in Grad (Standard: 30)
  - `azimuth`: Dachausrichtung in Grad (Standard: 180 = Süden)

**Beispiel-Request:**
```
GET http://localhost:3000/api/solar?lat=51.5413&lng=9.9158&area=15&tilt=35&azimuth=180
```

**Beispiel-Response:**
```json
{
  "inputs": {
    "lat": 51.5413,
    "lng": 9.9158,
    "area": 15,
    "tilt": 35,
    "azimuth": 180
  },
  "yield": {
    "annual_kWh": 1000
  },
  "co2": 0.5,
  "cache": "cached_data_here"
}
```

### 2. Frontend (React)

#### App-Komponente (`frontend/src/App.jsx`)
- **API-Base-URL:** `http://localhost:3000/api`
- **Funktionen:**
  - `fetchSolarData()`: Macht HTTP-Request an das Backend
  - `testBackendConnection()`: Testet die Verbindung mit Göttingen-Koordinaten

#### Datenfluss im Frontend:
1. Benutzer klickt "Solar-Daten abrufen" Button
2. `testBackendConnection()` wird aufgerufen
3. `fetchSolarData()` macht HTTP-Request an Backend
4. Backend verarbeitet Anfrage und sendet JSON-Antwort
5. Frontend zeigt die erhaltenen Daten an

## Wie starte ich die Anwendung?

### 1. Backend starten
```bash
cd backend
npm install
npm start
```
Das Backend läuft dann auf `http://localhost:3000`

### 2. Frontend starten
```bash
cd frontend
npm install
npm run dev
```
Das Frontend läuft dann auf `http://localhost:5173`

### 3. Testen der Verbindung
1. Öffne `http://localhost:5173` im Browser
2. Klicke den "Solar-Daten abrufen (Göttingen)" Button
3. Das Frontend macht einen Request an das Backend
4. Du siehst die erhaltenen Daten oder Fehlermeldungen

## Debugging

### Backend-Logs
Das Backend loggt alle Anfragen in der Konsole:
```
🌞 Solar-Anfrage erhalten: { lat: '51.5413', lng: '9.9158', area: '15', tilt: '35', azimuth: '180' }
✅ Solar-Daten erfolgreich berechnet: { inputs: {...}, yield: {...}, co2: 0.5, cache: {...} }
```

### Frontend-Logs
Öffne die Browser-Entwicklertools (F12) und schaue in die Konsole für detaillierte Logs.

### Häufige Probleme
1. **CORS-Fehler:** Backend läuft nicht oder CORS ist nicht konfiguriert
2. **Port-Konflikte:** Stelle sicher, dass Port 3000 und 5173 frei sind
3. **API-Fehler:** Überprüfe die Backend-Logs für Details

## Erweiterte Funktionen

### Neue Route hinzufügen
1. Erstelle neue Route-Datei in `backend/src/routes/`
2. Importiere und binde sie in `server.ts` ein
3. Erstelle entsprechende Frontend-Funktionen

### Datenbank-Integration
Das Backend ist bereits für Caching vorbereitet (`solarCache.ts`). Hier können echte Solar-Berechnungen und Datenbankabfragen implementiert werden.

## Technologie-Stack
- **Backend:** Node.js, Express, Zod (Validierung)
- **Frontend:** React, Vite
- **Kommunikation:** HTTP REST API, JSON
- **Entwicklung:** TypeScript (Backend), JavaScript (Frontend)
