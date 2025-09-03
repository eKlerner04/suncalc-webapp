# SunCalc WebApp

Eine Webanwendung zur Berechnung des Solarpotentials von Dächern.

**Entwickelt von:** Emil Klerner  
**Universität:** Georg-August-Universität Göttingen  
**Semester:** IV - Praktikum Webentwicklung

## 📂 Repository

**Repository-URL:** [GitHub Repository](https://github.com/emilklerner/suncalc-webapp)  
**Zugriff für:** lorenz.glissmann@uni-goettingen.de (Zugriff gewährt)

### Alternative: ZIP-Download
Falls Repository-Zugriff nicht möglich ist, kann das Projekt als ZIP-Datei heruntergeladen werden.

## 📋 Systemweite Abhängigkeiten

### Voraussetzungen
- **Node.js** (Version 18 oder höher)
- **npm** (kommt mit Node.js)
- **Git** (für Repository-Zugriff)

### Installation der Abhängigkeiten

#### 1. Node.js installieren
```bash
# macOS (mit Homebrew)
brew install node

# Windows (Download von nodejs.org)
# https://nodejs.org/

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm

# Überprüfen der Installation
node --version  # sollte 18+ sein
npm --version
```

#### 2. Git installieren
```bash
# macOS (mit Homebrew)
brew install git

# Windows (Download von git-scm.com)
# https://git-scm.com/

# Linux (Ubuntu/Debian)
sudo apt install git
```

## 🚀 Schnellstart

### 1. Repository klonen
```bash
git clone <REPOSITORY-URL>
cd suncalc-webapp
```

### 2. Lokale Abhängigkeiten installieren

#### Backend-Abhängigkeiten
```bash
cd backend
npm install
```

#### Frontend-Abhängigkeiten
```bash
cd frontend
npm install
```

### 3. Anwendung im Entwicklungsmodus starten

#### Backend starten (Terminal 1)
```bash
cd backend
npm run dev
# oder für Produktionsmodus:
npm run build && npm start
```
Das Backend läuft dann auf `http://localhost:3000`

#### Frontend starten (Terminal 2)
```bash
cd frontend
npm run dev
```
Das Frontend läuft dann auf `http://localhost:5173`

### 4. Anwendung testen
1. Öffne `http://localhost:5173` im Browser
2. Klicke "Solar-Potential berechnen (Göttingen)"
3. Das Frontend kommuniziert mit dem Backend und zeigt die Ergebnisse an

## 🔧 Build-Instruktionen

### Backend bauen
```bash
cd backend
npm run build
# Erstellt dist/ Ordner mit kompiliertem TypeScript
```

### Frontend bauen
```bash
cd frontend
npm run build
# Erstellt dist/ Ordner mit optimiertem React-Build
```

### Produktions-Deployment
```bash
# Backend
cd backend
npm run build
npm start

# Frontend (für statisches Hosting)
cd frontend
npm run build
# dist/ Ordner kann auf jeden Web-Server deployed werden
```

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
