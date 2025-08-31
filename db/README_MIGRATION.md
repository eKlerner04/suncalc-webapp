# Migration: Strahlungsfelder zu solar_cells hinzufügen

## Übersicht
Diese Migration fügt neue Felder zur `solar_cells` Tabelle hinzu, um die Solar-Berechnungen zu verbessern und die Performance zu steigern.

## Neue Felder

### 1. `radiation_data` (JSON)
- **Typ**: JSON
- **Größe**: Max. 1MB
- **Inhalt**: DNI, GHI, DIF Strahlungswerte
- **Zweck**: Speichert die wissenschaftlichen Strahlungsdaten von PVGIS und NASA

### 2. `extended_metadata` (JSON)
- **Typ**: JSON
- **Größe**: Max. 2MB
- **Inhalt**: Erweiterte Berechnungsannahmen
- **Zweck**: Speichert detaillierte Informationen über Modulwirkungsgrad, Verluste etc.

### 3. `calculation_quality` (Select)
- **Typ**: Select
- **Werte**: `high`, `medium`, `low`, `estimated`
- **Zweck**: Zeigt die Qualität der Berechnung an

### 4. `last_validation` (Date)
- **Typ**: Date
- **Zweck**: Zeitpunkt der letzten Datenvalidierung

## Neue Indizes

### 1. `idx_radiation_data`
- **Spalte**: `radiation_data`
- **Zweck**: Schnellere Suche nach Strahlungsdaten

### 2. `idx_calculation_quality`
- **Spalte**: `calculation_quality`
- **Zweck**: Filterung nach Berechnungsqualität

## Vorteile der neuen Felder

### Performance-Verbesserung
- **Schnellere Abfragen**: Strahlungsdaten sind direkt verfügbar
- **Weniger API-Calls**: Daten werden lokal gecacht
- **Bessere Indizierung**: Optimierte Datenbankabfragen

### Datenqualität
- **Wissenschaftliche Grundlage**: DNI, GHI, DIF von seriösen APIs
- **Transparenz**: Klare Angabe der Berechnungsqualität
- **Nachverfolgbarkeit**: Zeitstempel der Validierung

### Realistische Berechnungen
- **Modulwirkungsgrad**: 18-20% (statt geschätzte 15%)
- **Systemverluste**: Detaillierte Aufschlüsselung aller Verluste
- **Temperaturverluste**: Berücksichtigung der Betriebstemperatur
- **Verschmutzung**: Realistische Verschmutzungsverluste

## Durchführung der Migration

### 1. Backup erstellen
```bash
# Pocketbase-Daten sichern
cp pb_data/data.db pb_data/data.db.backup
```

### 2. Migration ausführen
```bash
# In das pb-Verzeichnis wechseln
cd pb

# Migration ausführen
./pocketbase migrate up
```

### 3. Überprüfung
```bash
# Prüfen ob neue Felder existieren
./pocketbase serve --dev
```

## Rollback (falls nötig)

```bash
# Migration rückgängig machen
./pocketbase migrate down
```

## API-Änderungen

### Neue Strahlungswerte
Die API gibt jetzt zusätzlich zurück:
```json
{
  "radiation": {
    "dni": 1200.5,        // Direct Normal Irradiation
    "ghi": 1100.2,        // Global Horizontal Irradiation  
    "dif": 300.8,         // Diffuse Horizontal Irradiation
    "annual_total": 1350.3 // Gesamtstrahlung auf geneigte Fläche
  }
}
```

### Erweiterte Metadaten
```json
{
  "metadata": {
    "assumptions": {
      "panel_efficiency": 20,      // Modulwirkungsgrad in %
      "inverter_efficiency": 96,   // Wechselrichterwirkungsgrad in %
      "temperature_losses": 5,     // Temperaturverluste in %
      "soiling_losses": 3,         // Verschmutzungsverluste in %
      "shading_losses": 2,         // Verschattungsverluste in %
      "wiring_losses": 2           // Leitungsverluste in %
    }
  }
}
```

## Frontend-Änderungen

### Neue Anzeige
- **Strahlungswerte-Sektion**: Zeigt DNI, GHI, DIF an
- **Qualitätsindikator**: Zeigt Berechnungsqualität an
- **Detaillierte Verluste**: Aufschlüsselung aller Systemverluste

### Verbesserte Validierung
- **Mindestfläche**: 0,01 m² statt 1 m²
- **Realistische Werte**: Berücksichtigung aller Verluste
- **Wissenschaftliche Grundlage**: Daten von PVGIS und NASA

## Wartung

### Regelmäßige Validierung
- **TTL**: 90 Tage für Strahlungsdaten
- **Qualitätsprüfung**: Automatische Bewertung der Datenqualität
- **API-Monitoring**: Überwachung der externen APIs

### Performance-Optimierung
- **Indizes**: Regelmäßige Überprüfung der Datenbankindizes
- **Cache-Size**: Überwachung der Datenbankgröße
- **Query-Optimierung**: Analyse der häufigsten Abfragen
