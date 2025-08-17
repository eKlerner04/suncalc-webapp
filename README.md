# SunCalc WebApp

Eine Webanwendung zur Berechnung des Solarpotentials von Dächern.

## 🚀 Schnellstart

### 1. Backend starten
```bash
cd backend
npm install
npm start
```
Das Backend läuft dann auf `http://localhost:3000`

### 2. Frontend starten (in einem neuen Terminal)
```bash
cd frontend
npm install
npm run dev
```
Das Frontend läuft dann auf `http://localhost:5173`

### 3. Anwendung testen
1. Öffne `http://localhost:5173` im Browser
2. Klicke "Solar-Potential berechnen (Göttingen)"
3. Das Frontend kommuniziert mit dem Backend und zeigt die Ergebnisse an

## 📁 Projektstruktur

```
suncalc-webapp/
├── backend/              # Node.js + Express Backend
│   ├── src/
│   │   ├── routes/      # API-Routen
│   │   ├── services/    # Geschäftslogik
│   │   └── utils/       # Hilfsfunktionen
│   └── package.json
├── frontend/             # React Frontend
│   ├── src/
│   │   ├── components/  # React-Komponenten
│   │   ├── services/    # API-Services
│   │   └── App.jsx      # Hauptkomponente
│   └── package.json
└── docs/                 # Dokumentation
```

## 🔧 Entwicklung

### Backend-Entwicklung
- **Entwicklungsmodus:** `npm run dev` (mit Auto-Reload)
- **Produktionsmodus:** `npm run build && npm run start:prod`

### Frontend-Entwicklung
- **Entwicklungsmodus:** `npm run dev` (mit Hot Reload)
- **Produktionsmodus:** `npm run build`

## 📚 Weitere Dokumentation

- **Architektur:** Siehe `docs/ARCHITECTURE.md`
- **Frontend-Details:** Siehe `frontend/README.md`

## 🐛 Häufige Probleme

### Backend startet nicht
- Stelle sicher, dass Port 3000 frei ist
- Verwende `npm start` (nicht `npm run start:prod`)

### Frontend kann Backend nicht erreichen
- Überprüfe, ob das Backend läuft
- Schaue in die Browser-Konsole für CORS-Fehler
- Überprüfe die Backend-Logs

### Port-Konflikte
- Backend: Port 3000
- Frontend: Port 5173
- Stelle sicher, dass beide Ports frei sind
