# Database Layer

Dieser Ordner enthält alle datenbankbezogenen Komponenten des SunCalc-Projekts.

## 📁 Struktur

```
db/
├── migrations/       # PocketBase-Datenbankmigrationen
├── schema/           # Datenbankschema-Definitionen
└── README.md         # Diese Datei
```

## 🔧 Komponenten

### **migrations/**
- PocketBase-Migrationen für Datenbankschema-Updates

### **schema/**
- **`solar_cells.json`** - Schema-Definition für Solar-Zellen

## 🚀 Verwendung

### **Im Backend:**
```typescript
import { solarCacheService } from '../services/solarCache';
import { pb, SOLAR_COLLECTION } from '../utils/pb';
```

### **Cache-Strategien:**
- **Fall A:** Frische Daten aus Cache
- **Fall B:** Veraltete Daten + Hintergrund-Update
- **Fall C:** Externe APIs + Cache-Speicherung

## 🎯 Vorteile

1. **Zentrale Verwaltung** aller DB-Schema-Dateien
2. **Klare Trennung** von Schema und Business-Logik
3. **Wiederverwendbarkeit** in verschiedenen Teilen der Anwendung
4. **Übersichtliche Struktur** für Entwickler

## 📝 Hinweis

**Client und Cache-Services** sind jetzt im `backend/src/` Ordner:
- **`backend/src/utils/pb.ts`** - PocketBase-Client
- **`backend/src/services/solarCache.ts`** - Cache-Service
