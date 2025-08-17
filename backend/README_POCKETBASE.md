# PocketBase Integration für SunCalc Backend

## Übersicht

Das Backend verwendet PocketBase als lokale Datenbank für das Caching von Solar-Daten. Jede Rasterzelle (1km x 1km) wird als separater Datensatz gespeichert.

## Installation & Setup

### 1. PocketBase herunterladen
```bash
# Gehe zu https://pocketbase.io/ und lade die passende Version herunter
# Oder verwende den pb-Ordner im Projekt (falls vorhanden)
```

### 2. PocketBase starten
```bash
cd backend
./pb/pocketbase serve --http 127.0.0.1:8090 --dir pb_data
```

### 3. Collection erstellen
1. Öffne http://127.0.0.1:8090/_/ in deinem Browser
2. Gehe zu "Collections" → "New collection"
3. Importiere das Schema aus `pb_schema/solar_cells.json`
4. Oder erstelle die Collection manuell mit den Feldern aus dem Schema

## Datenstruktur

### Collection: `solar_cells`

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `gridKey` | text | Eindeutiger Schlüssel für Rasterzelle (z.B. "51.54_9.92") |
| `latRounded` | number | Gerundete Breitengrad-Koordinate |
| `lngRounded` | number | Gerundete Längengrad-Koordinate |
| `payload` | json | Solar-Daten von externen APIs |
| `source` | select | Datenquelle: local/local_stale/external/fallback |
| `fetchedAt` | date | Wann die Daten abgerufen wurden |
| `lastAccessAt` | date | Wann die Daten zuletzt abgerufen wurden |
| `ttlDays` | number | Time-to-Live in Tagen (Standard: 90) |

## Cache-Strategie

### Fall A: Frische Daten im Cache
- ✅ Daten werden sofort aus der DB geliefert
- ✅ `source: "local"`
- ✅ `lastAccessAt` wird aktualisiert

### Fall B: Veraltete Daten im Cache
- ⚠️ Daten werden sofort aus der DB geliefert
- ⚠️ `source: "local_stale"`
- 🔄 Background-Refresh wird gestartet
- ✅ `lastAccessAt` wird aktualisiert

### Fall C: Keine Daten im Cache
- 🔄 Externe API wird aufgerufen
- 💾 Neue Daten werden in DB gespeichert
- ✅ `source: "external"`

## Verwendung im Code

### Cache-Service importieren
```typescript
import { solarCacheService } from '../services/solarCache';

// Solar-Daten abrufen (mit automatischem Caching)
const { data, source } = await solarCacheService.getSolarData(lat, lng);
```

### Direkter PocketBase-Zugriff
```typescript
import { pb, SOLAR_COLLECTION } from '../utils/pb';

// Alle Solar-Zellen abrufen
const records = await pb.collection(SOLAR_COLLECTION).getList(1, 50);

// Nach Grid-Key suchen
const record = await pb.collection(SOLAR_COLLECTION).getFirstListItem(`gridKey = "${gridKey}"`);
```

## Konfiguration

### PocketBase-URL ändern
In `src/utils/pb.ts`:
```typescript
export const pb = new PocketBase('http://deine-pb-url:8090');
```

### TTL-Werte anpassen
In `src/services/solarCache.ts`:
```typescript
ttlDays: 90 // Standard: 90 Tage
```

## Monitoring & Debugging

### Logs überwachen
Das Backend loggt alle Cache-Operationen:
```
🔍 Cache-Check für 51.54_9.92 (lat=51.5413, lng=9.9158)
✅ Fall A: Frische Daten aus Cache (51.54_9.92)
💾 Neue Daten für 51.54_9.92 in DB gespeichert
```

### PocketBase Admin-Interface
- URL: http://127.0.0.1:8090/_/
- Alle Datensätze einsehen
- Daten manuell bearbeiten
- Performance-Metriken überwachen

## Erweiterte Funktionen

### Batch-Operationen
```typescript
// Alle veralteten Datensätze finden
const staleRecords = await pb.collection(SOLAR_COLLECTION).getList(1, 1000, {
  filter: `fetchedAt < "${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()}"`
});
```

### Statistiken
```typescript
// Anzahl Datensätze pro Source
const stats = await pb.collection(SOLAR_COLLECTION).getList(1, 1, {
  fields: 'source'
});
```

## Troubleshooting

### PocketBase startet nicht
- Port 8090 ist bereits belegt
- Berechtigungen für pb_data-Ordner fehlen
- PocketBase-Binary ist beschädigt

### Verbindungsfehler
- PocketBase läuft nicht
- Falsche URL in der Konfiguration
- Firewall blockiert Verbindung

### Daten werden nicht gespeichert
- Collection existiert nicht
- Schema-Felder stimmen nicht überein
- Berechtigungen fehlen
