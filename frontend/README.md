# SunCalc Frontend

## Projektstruktur

Das Frontend ist sauber in verschiedene Komponenten und Services aufgeteilt:

```
src/
├── components/           # React-Komponenten
│   ├── Header.jsx       # Header mit Titel und Untertitel
│   ├── Footer.jsx       # Footer mit Links
│   ├── SolarCalculator.jsx  # Solar-Berechnungs-Interface
│   └── ArchitectureInfo.jsx # Erklärung der Architektur
├── services/            # API-Services
│   └── api.js          # Backend-Kommunikation
├── App.jsx             # Hauptkomponente (importiert alle anderen)
├── App.css             # Styling
└── main.jsx            # React-Einstiegspunkt
```

## Komponenten im Detail

### 1. Header.jsx
- Zeigt den Titel "SunCalc" und Untertitel an
- Einfache, wiederverwendbare Komponente

### 2. SolarCalculator.jsx
- **Funktion:** Hauptkomponente für Solar-Berechnungen
- **State:** Verwaltet loading, error und solarData
- **API-Call:** Ruft `fetchSolarData()` aus dem API-Service auf
- **UI:** Button, Fehleranzeige und Ergebnisdarstellung

### 3. ArchitectureInfo.jsx
- **Funktion:** Erklärt dem Benutzer, wie Frontend und Backend zusammenarbeiten
- **Inhalt:** Architektur-Übersicht, Datenfluss, Projektstruktur

### 4. Footer.jsx
- Zeigt Impressum und Datenschutzerklärung Links an
- Einfache, wiederverwendbare Komponente

## Services

### api.js
- **Zweck:** Zentrale Stelle für alle Backend-Kommunikation
- **Funktionen:**
  - `fetchSolarData()`: Ruft Solar-Daten vom Backend ab
  - `checkBackendHealth()`: Prüft ob das Backend läuft
- **Konfiguration:** API_BASE_URL = 'http://localhost:3000/api'

## Vorteile der neuen Struktur

1. **Übersichtlichkeit:** Jede Komponente hat eine klare Aufgabe
2. **Wiederverwendbarkeit:** Komponenten können in anderen Teilen der App verwendet werden
3. **Wartbarkeit:** Änderungen können isoliert in einzelnen Dateien gemacht werden
4. **Testbarkeit:** Jede Komponente kann einzeln getestet werden
5. **Teamarbeit:** Verschiedene Entwickler können an verschiedenen Komponenten arbeiten

## Wie funktioniert die Kommunikation?

1. **Benutzer klickt Button** in `SolarCalculator.jsx`
2. **SolarCalculator ruft** `fetchSolarData()` aus `api.js` auf
3. **API-Service macht** HTTP-Request an Backend (`/api/solar`)
4. **Backend antwortet** mit JSON-Daten
5. **SolarCalculator zeigt** die Daten an

## Entwicklung

### Neue Komponente hinzufügen:
1. Erstelle neue Datei in `src/components/`
2. Exportiere die Komponente als default
3. Importiere sie in `App.jsx`
4. Füge sie zum JSX hinzu

### Neuen Service hinzufügen:
1. Erstelle neue Datei in `src/services/`
2. Exportiere die Funktionen
3. Importiere sie in den Komponenten, die sie brauchen

## Starten der Anwendung

```bash
npm install
npm run dev
```

Das Frontend läuft dann auf `http://localhost:5173`
