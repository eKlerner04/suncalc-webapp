# SunCalc – Solarpotential für Dächer berechnen

## Projektidee
Interaktive Web-App zur Berechnung des Solarpotentials von Dächern.  
Nutzer:innen wählen eine Adresse oder klicken auf eine Karte → App berechnet potenziellen Stromertrag + CO₂-Ersparnis.

## Struktur
- `frontend/`: Benutzeroberfläche (Leaflet, Diagramme, UI).
- `backend/`: REST-API (Node.js).
- `db/`: Datenbankschema, PocketBase.
- `infra/`: Server-Konfiguration (Caddy, systemd).
- `docs/`: Hausarbeit, Diagramme, Architektur.

## Entwicklungs-Setup
### Voraussetzungen
- Node.js >= 22
- npm oder pnpm
- PocketBase (Download: https://pocketbase.io/)
- GWDG Cloud-Server (für Deployment)

### Start (lokal)
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
