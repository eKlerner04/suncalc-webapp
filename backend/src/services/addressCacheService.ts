import { pb } from '../utils/pb';

interface AddressData {
  lat: number;
  lng: number;
  displayName: string;
  name: string;
  source: string;
  countryCode?: string;
}

interface CachedAddress {
  id: string;
  lat: number;
  lng: number;
  displayName: string;
  shortName: string;
  searchCount: number;
  lastSearched: string;
  createdAt: string;
  countryCode: string;
  isPopular: boolean;
  source: string;
}

class AddressCacheService {
  private readonly collectionName = 'address_cache';

  /**
   * Adresse in der lokalen Datenbank suchen
   */
  async searchLocalDatabase(query: string): Promise<AddressData[]> {
    try {
      console.log(`🔍 Suche nach Adresse in lokaler Datenbank: "${query}"`);
      
      const filter = `(displayName~"${query}" || shortName~"${query}")`;
      const sort = '-searchCount,-lastSearched';
      
      const records = await pb.collection(this.collectionName).getList(1, 5, {
        filter,
        sort
      });

      console.log(`✅ Gefunden: ${records.items.length} lokale Ergebnisse für "${query}"`);
      
      return records.items.map(item => ({
        lat: item.lat,
        lng: item.lng,
        displayName: item.displayName,
        name: item.shortName,
        source: item.source
      }));
    } catch (error) {
      console.error(`❌ Fehler bei lokaler Datenbank-Suche für "${query}":`, error);
      return [];
    }
  }

  /**
   * Zentrale Funktion für alle Adress-Operationen
   * Verhindert Duplikate und koordiniert alle Speicher-Operationen
   */
  async processAddressOperation(
    lat: number, 
    lng: number, 
    displayName: string, 
    name: string, 
    source: string,
    countryCode?: string
  ): Promise<{ success: boolean; isNew: boolean; addressId?: string }> {
    try {
      console.log(`🔄 Zentrale Adress-Operation: ${displayName} (${lat}, ${lng}) von ${source}`);
      
      // Prüfe zuerst, ob bereits ein Eintrag existiert
      const existingAddress = await this.findExistingAddress(lat, lng);
      
      if (existingAddress) {
        console.log(`✅ Bestehende Adresse gefunden: ${existingAddress.displayName} (ID: ${existingAddress.id})`);
        
        // Aktualisiere den bestehenden Eintrag
        await this.updateExistingAddress(existingAddress.id, {
          lat,
          lng,
          displayName,
          name,
          source,
          countryCode
        });
        
        return { 
          success: true, 
          isNew: false, 
          addressId: existingAddress.id 
        };
      }

      // Erstelle neuen Eintrag
      console.log(`💾 Erstelle neuen Adress-Eintrag: ${displayName}`);
      
      const addressData: AddressData = {
        lat,
        lng,
        displayName,
        name,
        source,
        countryCode
      };

      const success = await this.saveToDatabase(addressData);
      
      if (success) {
        console.log(`✅ Neuer Adress-Eintrag erfolgreich erstellt: ${displayName}`);
        return { success: true, isNew: true };
      } else {
        console.warn(`⚠️ Fehler beim Erstellen des neuen Adress-Eintrags: ${displayName}`);
        return { success: false, isNew: false };
      }
    } catch (error) {
      console.error(`❌ Fehler in zentraler Adress-Operation:`, error);
      return { success: false, isNew: false };
    }
  }

  /**
   * Neue Adresse in der Datenbank speichern (nur für neue Einträge)
   */
  async saveToDatabase(addressData: AddressData): Promise<boolean> {
    try {
      console.log(`💾 Speichere neue Adresse in Datenbank: ${addressData.displayName}`);
      
      const addressRecord = {
        lat: addressData.lat,
        lng: addressData.lng,
        displayName: addressData.displayName,
        shortName: addressData.name,
        searchCount: 1,
        lastSearched: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        countryCode: addressData.countryCode || this.extractCountryCode(addressData.displayName),
        isPopular: false,
        source: addressData.source
      };

      const record = await pb.collection(this.collectionName).create(addressRecord);
      
      console.log(`✅ Adresse erfolgreich gespeichert mit ID: ${record.id}`);
      return true;
    } catch (error) {
      console.error(`❌ Fehler beim Speichern der Adresse "${addressData.displayName}":`, error);
      return false;
    }
  }

  /**
   * Suchzähler für eine Adresse erhöhen
   */
  async incrementSearchCount(addressId: string): Promise<void> {
    try {
      console.debug(`📈 Erhöhe Suchzähler für Adresse ID: ${addressId}`);
      
      await pb.collection(this.collectionName).update(addressId, {
        searchCount: { $increment: 1 },
        lastSearched: new Date().toISOString()
      });
      
      console.debug(`✅ Suchzähler erfolgreich erhöht für ID: ${addressId}`);
    } catch (error) {
      console.error(`❌ Fehler beim Erhöhen des Suchzählers für ID ${addressId}:`, error);
    }
  }

  /**
   * Aktuelle Koordinaten in Datenbank speichern
   */
  async saveCurrentLocation(lat: number, lng: number, displayName?: string): Promise<boolean> {
    try {
      console.log(`📍 Speichere aktuellen Standort: ${lat}, ${lng}`);
      
      // Wenn ein informativer displayName übergeben wurde, verwende diesen
      if (displayName && displayName !== 'Unbekannter Standort') {
        console.log(`📝 Verwende übergebenen displayName: ${displayName}`);
        
        const result = await this.processAddressOperation(
          lat,
          lng,
          displayName,
          displayName.split(',')[0], // Verwende den ersten Teil als shortName
          'Solar Calculation'
        );
        
        if (result.success) {
          if (result.isNew) {
            console.log(`✅ Neuer informativer Standort erfolgreich gespeichert: ${displayName}`);
          } else {
            console.log(`🔄 Bestehender informativer Standort aktualisiert: ${displayName}`);
          }
        } else {
          console.warn(`⚠️ Fehler beim Speichern des informativen Standorts: ${displayName}`);
        }
        
        return result.success;
      }
      
      // Wenn kein informativer displayName übergeben wurde, prüfe ob bereits einer existiert
      const existingAddresses = await this.getAddressesForLocation(lat, lng);
      
      if (existingAddresses.length > 0) {
        // Suche nach dem informativsten bestehenden Eintrag
        const bestAddress = existingAddresses.sort((a, b) => {
          // Priorität 1: Informativer Name
          const aIsInformative = a.displayName !== 'Unbekannter Standort';
          const bIsInformative = b.displayName !== 'Unbekannter Standort';
          
          if (aIsInformative && !bIsInformative) return -1;
          if (!aIsInformative && bIsInformative) return 1;
          
          // Priorität 2: Höherer searchCount
          return b.searchCount - a.searchCount;
        })[0];
        
        if (bestAddress && bestAddress.displayName !== 'Unbekannter Standort') {
          console.log(`🔄 Informativer Eintrag bereits vorhanden: ${bestAddress.displayName}`);
          // Erhöhe nur den Suchzähler
          await this.incrementSearchCount(bestAddress.id);
          return true;
        }
      }
      
      // Nur "Unbekannter Standort" erstellen, wenn wirklich keine informative Adresse existiert
      console.log(`⚠️ Keine informative Adresse gefunden, erstelle "Unbekannter Standort"`);
      
      const result = await this.processAddressOperation(
        lat,
        lng,
        'Unbekannter Standort',
        'Unbekannt',
        'Map Selection'
      );
      
      if (result.success) {
        if (result.isNew) {
          console.log(`✅ Neuer "Unbekannter Standort" erfolgreich gespeichert: ${lat}, ${lng}`);
        } else {
          console.log(`🔄 Bestehender "Unbekannter Standort" aktualisiert: ${lat}, ${lng}`);
        }
      } else {
        console.warn(`⚠️ Fehler beim Speichern des "Unbekannter Standort": ${lat}, ${lng}`);
      }
      
      return result.success;
    } catch (error) {
      console.error(`❌ Fehler beim Speichern des aktuellen Standorts:`, error);
      return false;
    }
  }

  /**
   * Schnellstandort in Datenbank speichern
   */
  async saveQuickLocation(lat: number, lng: number, name: string): Promise<boolean> {
    try {
      console.log(`🚀 Speichere Schnellstandort: ${name} (${lat}, ${lng})`);
      
      const result = await this.processAddressOperation(
        lat,
        lng,
        name,
        name,
        'Quick Location'
      );
      
      if (result.success) {
        if (result.isNew) {
          console.log(`✅ Neuer Schnellstandort erfolgreich gespeichert: ${name} (${lat}, ${lng})`);
        } else {
          console.log(`🔄 Bestehender Schnellstandort aktualisiert: ${name} (${lat}, ${lng})`);
        }
      } else {
        console.warn(`⚠️ Fehler beim Speichern des Schnellstandorts: ${name}`);
      }
      
      return result.success;
    } catch (error) {
      console.error(`❌ Fehler beim Speichern des Schnellstandorts "${name}":`, error);
      return false;
    }
  }

  /**
   * Adresse aus Suchergebnissen speichern
   */
  async saveFromSearchResult(result: any, source: string = 'Nominatim API'): Promise<boolean> {
    try {
      console.log(`🔍 Speichere Suchergebnis: ${result.displayName}`);
      
      const addressResult = await this.processAddressOperation(
        result.lat,
        result.lng,
        result.displayName,
        result.name,
        source,
        result.countryCode
      );
      
      if (addressResult.success) {
        if (addressResult.isNew) {
          console.log(`✅ Neues Suchergebnis erfolgreich gespeichert: ${result.displayName}`);
        } else {
          console.log(`🔄 Bestehendes Suchergebnis aktualisiert: ${result.displayName}`);
        }
      } else {
        console.warn(`⚠️ Fehler beim Speichern des Suchergebnisses: ${result.displayName}`);
      }
      
      return addressResult.success;
    } catch (error) {
      console.error(`❌ Fehler beim Speichern des Suchergebnisses:`, error);
      return false;
    }
  }

  /**
   * Land-Code aus Adresse extrahieren
   */
  private extractCountryCode(displayName: string): string {
    const countryMap: { [key: string]: string } = {
      'Deutschland': 'DE',
      'Germany': 'DE',
      'Österreich': 'AT',
      'Austria': 'AT',
      'Schweiz': 'CH',
      'Switzerland': 'CH'
    };

    for (const [country, code] of Object.entries(countryMap)) {
      if (displayName.includes(country)) {
        return code;
      }
    }
    return 'DE'; // Standard
  }

  /**
   * Alle Adressen für einen Standort abrufen
   */
  async getAddressesForLocation(lat: number, lng: number): Promise<CachedAddress[]> {
    try {
      console.debug(`🔍 Suche Adressen für Standort: ${lat}, ${lng}`);
      
      // Verwende Toleranz für die Suche (wie in findExistingAddress)
      const tolerance = 0.001; // Etwa 100 Meter Toleranz
      const filter = `lat >= ${lat - tolerance} && lat <= ${lat + tolerance} && lng >= ${lng - tolerance} && lng <= ${lng + tolerance}`;
      
      console.debug(`🔍 Suche mit Filter: ${filter}`);
      
      const records = await pb.collection(this.collectionName).getList(1, 10, { filter });
      
      console.debug(`✅ Gefunden: ${records.items.length} Adressen für Standort ${lat}, ${lng}`);
      
      return records.items.map(item => ({
        id: item.id,
        lat: item.lat,
        lng: item.lng,
        displayName: item.displayName,
        shortName: item.shortName,
        searchCount: item.searchCount,
        lastSearched: item.lastSearched,
        createdAt: item.createdAt,
        countryCode: item.countryCode,
        isPopular: item.isPopular,
        source: item.source
      }));
    } catch (error) {
      console.error(`❌ Fehler beim Abrufen der Adressen für Standort ${lat}, ${lng}:`, error);
      return [];
    }
  }

  /**
   * Popularität einer Adresse aktualisieren
   */
  async updatePopularity(addressId: string, isPopular: boolean): Promise<void> {
    try {
      console.debug(`⭐ Aktualisiere Popularität für ID ${addressId}: ${isPopular}`);
      
      await pb.collection(this.collectionName).update(addressId, {
        isPopular
      });
      
      console.debug(`✅ Popularität erfolgreich aktualisiert für ID: ${addressId}`);
    } catch (error) {
      console.error(`❌ Fehler beim Aktualisieren der Popularität für ID ${addressId}:`, error);
    }
  }

  /**
   * Bestehende Duplikate bereinigen
   */
  async cleanupDuplicates(): Promise<void> {
    try {
      console.log('🧹 Starte Bereinigung von Duplikaten...');
      
      // Hole alle Adressen
      const allAddresses = await pb.collection(this.collectionName).getList(1, 1000);
      
      const duplicates: { [key: string]: CachedAddress[] } = {};
      
      // Gruppiere nach Koordinaten (mit Toleranz)
      for (const item of allAddresses.items) {
        const key = `${Math.round(item.lat * 10000) / 10000}_${Math.round(item.lng * 10000) / 10000}`;
        
        if (!duplicates[key]) {
          duplicates[key] = [];
        }
        duplicates[key].push({
          id: item.id,
          lat: item.lat,
          lng: item.lng,
          displayName: item.displayName,
          shortName: item.shortName,
          searchCount: item.searchCount,
          lastSearched: item.lastSearched,
          createdAt: item.createdAt,
          countryCode: item.countryCode,
          isPopular: item.isPopular,
          source: item.source
        });
      }
      
      let cleanedCount = 0;
      
      // Behalte nur den besten Eintrag pro Koordinate
      for (const [key, addressList] of Object.entries(duplicates)) {
        if (addressList.length > 1) {
          console.log(`🔄 Gefunden: ${addressList.length} Einträge für Koordinate ${key}`);
          
          // Sortiere nach Priorität: informativer Name > höherer searchCount > neuerer Eintrag
          addressList.sort((a, b) => {
            // Priorität 1: Informativer Name
            const aIsInformative = a.displayName !== 'Unbekannter Standort';
            const bIsInformative = b.displayName !== 'Unbekannter Standort';
            
            if (aIsInformative && !bIsInformative) return -1;
            if (!aIsInformative && bIsInformative) return 1;
            
            // Priorität 2: Höherer searchCount
            if (a.searchCount !== b.searchCount) {
              return b.searchCount - a.searchCount;
            }
            
            // Priorität 3: Neuerer Eintrag
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          const keepAddress = addressList[0];
          const deleteAddresses = addressList.slice(1);
          
          // Lösche Duplikate
          for (const duplicate of deleteAddresses) {
            try {
              await pb.collection(this.collectionName).delete(duplicate.id);
              console.log(`🗑️ Gelöscht: ${duplicate.displayName} (ID: ${duplicate.id})`);
              cleanedCount++;
            } catch (error) {
              console.error(`❌ Fehler beim Löschen von ${duplicate.id}:`, error);
            }
          }
          
          // Aktualisiere den behaltenen Eintrag mit der Summe der searchCounts
          const totalSearchCount = addressList.reduce((sum, addr) => sum + addr.searchCount, 0);
          await pb.collection(this.collectionName).update(keepAddress.id, {
            searchCount: totalSearchCount,
            lastSearched: new Date().toISOString()
          });
          
          console.log(`✅ Behalten: ${keepAddress.displayName} (ID: ${keepAddress.id}, searchCount: ${totalSearchCount})`);
        }
      }
      
      console.log(`🎉 Bereinigung abgeschlossen: ${cleanedCount} Duplikate entfernt`);
    } catch (error) {
      console.error('❌ Fehler bei der Bereinigung von Duplikaten:', error);
    }
  }

  /**
   * Bestehende Adresse mit gleichen Koordinaten finden
   */
  private async findExistingAddress(lat: number, lng: number): Promise<CachedAddress | null> {
    try {
      // Suche nach Einträgen mit den gleichen Koordinaten (mit Toleranz)
      const tolerance = 0.001; // Etwa 100 Meter Toleranz (vorher 10 Meter)
      const filter = `lat >= ${lat - tolerance} && lat <= ${lat + tolerance} && lng >= ${lng - tolerance} && lng <= ${lng + tolerance}`;
      
      console.log(`🔍 Suche mit Filter: ${filter}`);
      
      const records = await pb.collection(this.collectionName).getList(1, 10, { filter });
      
      console.log(`🔍 Gefunden: ${records.items.length} Einträge mit ähnlichen Koordinaten`);
      
      if (records.items.length > 0) {
        // Sortiere nach Priorität: informativer Name > höherer searchCount > neuerer Eintrag
        const sortedRecords = records.items.sort((a, b) => {
          // Priorität 1: Informativer Name
          const aIsInformative = a.displayName !== 'Unbekannter Standort';
          const bIsInformative = b.displayName !== 'Unbekannter Standort';
          
          if (aIsInformative && !bIsInformative) return -1;
          if (!aIsInformative && bIsInformative) return 1;
          
          // Priorität 2: Höherer searchCount
          if (a.searchCount !== b.searchCount) {
            return b.searchCount - a.searchCount;
          }
          
          // Priorität 3: Neuerer Eintrag
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        const bestMatch = sortedRecords[0];
        console.log(`✅ Bester Match gefunden: ${bestMatch.displayName} (ID: ${bestMatch.id})`);
        
        return {
          id: bestMatch.id,
          lat: bestMatch.lat,
          lng: bestMatch.lng,
          displayName: bestMatch.displayName,
          shortName: bestMatch.shortName,
          searchCount: bestMatch.searchCount,
          lastSearched: bestMatch.lastSearched,
          createdAt: bestMatch.createdAt,
          countryCode: bestMatch.countryCode,
          isPopular: bestMatch.isPopular,
          source: bestMatch.source
        };
      }
      
      console.log(`❌ Keine bestehende Adresse gefunden`);
      return null;
    } catch (error) {
      console.error('❌ Fehler beim Suchen nach bestehender Adresse:', error);
      return null;
    }
  }

  /**
   * Bestehenden Eintrag aktualisieren
   */
  private async updateExistingAddress(id: string, newData: AddressData): Promise<void> {
    try {
      console.log(`🔄 Aktualisiere bestehenden Eintrag (ID: ${id})`);
      
      const updateData: any = {
        searchCount: { $increment: 1 },
        lastSearched: new Date().toISOString()
      };
      
      // Aktualisiere displayName und shortName, falls sie informativer sind
      if (newData.displayName !== 'Unbekannter Standort') {
        updateData.displayName = newData.displayName;
        updateData.shortName = newData.name;
      }
      
      await pb.collection(this.collectionName).update(id, updateData);
      
      console.log(`✅ Bestehende Adresse aktualisiert (ID: ${id})`);
    } catch (error) {
      console.error(`❌ Fehler beim Aktualisieren der bestehenden Adresse:`, error);
    }
  }
}

export default new AddressCacheService();
