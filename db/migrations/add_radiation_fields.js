// Migration: Strahlungsfelder zu solar_cells hinzufügen
// Datum: 2024-01-XX
// Beschreibung: Fügt Felder für DNI, GHI, DIF und erweiterte Metadaten hinzu

migrate((db) => {
  // Neue Felder für Strahlungswerte
  const solarCells = db.collection('solar_cells');
  
  // Feld für Strahlungsdaten
  solarCells.schema.addField({
    name: 'radiation_data',
    type: 'json',
    required: false,
    options: {
      maxSize: 1000000
    }
  });
  
  // Feld für erweiterte Metadaten
  solarCells.schema.addField({
    name: 'extended_metadata',
    type: 'json',
    required: false,
    options: {
      maxSize: 2000000
    }
  });
  
  // Feld für Berechnungsqualität
  solarCells.schema.addField({
    name: 'calculation_quality',
    type: 'select',
    required: false,
    options: {
      values: ['high', 'medium', 'low', 'estimated']
    }
  });
  
  // Feld für letzte Validierung
  solarCells.schema.addField({
    name: 'last_validation',
    type: 'date',
    required: false
  });
  
  // Index für Strahlungsdaten
  solarCells.schema.addIndex({
    name: 'idx_radiation_data',
    columns: ['radiation_data']
  });
  
  // Index für Berechnungsqualität
  solarCells.schema.addIndex({
    name: 'idx_calculation_quality',
    columns: ['calculation_quality']
  });
  
  console.log('✅ Strahlungsfelder erfolgreich zu solar_cells hinzugefügt');
}, (db) => {
  // Rollback: Felder entfernen
  const solarCells = db.collection('solar_cells');
  
  try {
    solarCells.schema.removeField('radiation_data');
    solarCells.schema.removeField('extended_metadata');
    solarCells.schema.removeField('calculation_quality');
    solarCells.schema.removeField('last_validation');
    
    // Indizes entfernen
    solarCells.schema.removeIndex('idx_radiation_data');
    solarCells.schema.removeIndex('idx_calculation_quality');
    
    console.log('✅ Rollback erfolgreich: Strahlungsfelder entfernt');
  } catch (error) {
    console.error('❌ Fehler beim Rollback:', error);
  }
});
