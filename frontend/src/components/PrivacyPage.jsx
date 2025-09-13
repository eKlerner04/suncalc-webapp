import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PrivacyPage.css';

const PrivacyPage = () => {
  const slowScrollToTop = () => {
    const startPosition = window.pageYOffset;
    const targetPosition = 0;
    const distance = targetPosition - startPosition;
    const duration = 1500; 
    let start = null;
    
    const slowScroll = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      if (progress < 1) {
        requestAnimationFrame(slowScroll);
      }
    };
    
    requestAnimationFrame(slowScroll);
  };

  useEffect(() => {
    slowScrollToTop();
  }, []);

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="privacy-nav">
          <Link to="/" className="back-link" tabIndex={1}>← Zurück zur Hauptseite</Link>
          <h1>Datenschutz</h1>
        </div>

        <main className="privacy-content">
          <section className="privacy-section">
            <h2>Privacy by Design</h2>
            <div className="privacy-subsection">
              <h3>Anonyme Nutzung als Grundprinzip</h3>
              <p>
                Das System wurde vom Grund auf mit dem Prinzip der anonymen Nutzung entwickelt. 
                Es gibt kein Registrierungs- oder Anmeldesystem, wodurch keine Benutzeridentifikation stattfindet.
              </p>
            </div>

            <div className="privacy-subsection">
              <h3>Minimale Datensammlung</h3>
              <p>
                Das System sammelt ausschließlich Standortkoordinaten (Breiten- und Längengrad), 
                die in einem 5 km Raster anonymisiert gespeichert werden. Die Koordinaten werden 
                nicht mit personenbezogenen Daten verknüpft.
              </p>
            </div>

            <div className="privacy-subsection">
              <h3>Lokale Datenverarbeitung</h3>
              <p>
                Alle Daten werden in einer lokalen Pocketbase-Datenbank verarbeitet und gespeichert. 
                Es werden keine externen Tracking-Services oder Analytics-Tools verwendet, die 
                personenbezogene Daten sammeln können.
              </p>
            </div>

            <div className="privacy-subsection">
              <h3>Anonymes Popularity Tracking</h3>
              <p>
                Es werden lediglich accessCount, lastAccessAt und popularityScore für Standorte 
                gespeichert, ohne diese mit den Benutzern zu verknüpfen.
              </p>
            </div>
          </section>

          <section className="privacy-section">
            <h2>Verarbeitete personenbezogene Daten</h2>
            
            <div className="privacy-subsection">
              <h3>IP-Adresse</h3>
              <ul>
                <li><strong>Verarbeitung:</strong> Standardmäßig zwischen Client und Server</li>
                <li><strong>Zweck:</strong> Technische Kommunikation zwischen Client und Server</li>
              </ul>
            </div>

            <div className="privacy-subsection">
              <h3>Standort-Koordinaten</h3>
              <ul>
                <li><strong>Verarbeitung:</strong> Breiten- und Längengrad für Solar-Berechnungen</li>
                <li><strong>Anonymisierung:</strong> Koordinaten werden auf 5 km Raster gerundet (z.B. 52.5000_13.4000)</li>
                <li><strong>Speicherung:</strong> In solar_cells Collection als latRounded und lngRounded</li>
                <li><strong>Zweck:</strong> Solar-Berechnung und Caching Optimierung</li>
                <li><strong>Rückschlüsse:</strong> Keine Identifikation einzelner Benutzer möglich</li>
              </ul>
            </div>

            <div className="privacy-subsection">
              <h3>Lokaler Suchverlauf (Browser)</h3>
              <ul>
                <li><strong>Verarbeitung:</strong> Die letzten drei gesuchten Standorte und Berechnungsparameter</li>
                <li><strong>Speicherung:</strong> Lokal im Browser (localStorage), nicht auf dem Server</li>
                <li><strong>Zweck:</strong> Verbesserung der Benutzerfreundlichkeit bei wiederholten Besuchen</li>
                <li><strong>Löschung:</strong> Automatisch über Browser Einstellungen</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>Besondere Kategorien personenbezogener Daten</h2>
            <p>
              <strong>Nein:</strong> Es werden keine besonderen Kategorien personenbezogener Daten verarbeitet. 
              Keine Gesundheitsdaten, biometrische Daten oder andere sensible Informationen.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Betroffenenrechte</h2>
            
            <div className="privacy-subsection">
              <h3>Automatisierte Rechte</h3>
              <ul>
                <li><strong>Auskunft:</strong> Da keine personenbezogenen Daten auf dem Server gespeichert werden, ist keine Auskunft erforderlich</li>
                <li><strong>Löschung:</strong> Standortdaten werden automatisch nach TTL-Ablauf gelöscht (Cleanup Service)</li>
                <li><strong>Änderung:</strong> Nicht anwendbar, da keine personenbezogenen Daten vorhanden sind</li>
                <li><strong>Widerspruch:</strong> Nicht erforderlich, da keine Datenverarbeitung ohne Einwilligung stattfindet</li>
              </ul>
            </div>

            <div className="privacy-subsection">
              <h3>Manuelle Rechte (durch Administrator)</h3>
              <ul>
                <li><strong>Datenbank Bereinigung:</strong> Administrator kann Standortdaten manuell aus der Datenbank löschen</li>
                <li><strong>Log-Analyse:</strong> Server-Logs können auf IP-Adressen analysiert werden</li>
                <li><strong>Datenexport:</strong> Vollständige Datenbank kann exportiert werden (ohne personenbezogene Daten)</li>
              </ul>
            </div>

            <div className="privacy-subsection">
              <h3>Lokale Rechte (Suchverlauf)</h3>
              <ul>
                <li><strong>Auskunft:</strong> Benutzer kann Suchverlauf über Browser-Entwicklertools einsehen</li>
                <li><strong>Löschung:</strong> Automatisch über Browser-Einstellungen oder manuell über App Interface</li>
                <li><strong>Änderung:</strong> Nicht erforderlich, da nur lokale Speicherung</li>
                <li><strong>Widerspruch:</strong> Benutzer kann Suchverlauf-Funktion deaktivieren</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>Transparenz</h2>
            <ul>
              <li><strong>Datenschutzerklärung:</strong> Verlinkt auf offizielle Universität Göttingen Datenschutzerklärung</li>
              <li><strong>Keine Cookies:</strong> System verwendet keine Tracking Cookies</li>
              <li><strong>Open Source:</strong> Quellcode ist öffentlich einsehbar für Transparenz</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>Kontakt</h2>
            <p>
              <strong>E-Mail:</strong> e.klerner@stud.uni-goettingen.de
            </p>
            <p>
              <a href="https://www.uni-goettingen.de/de/datenschutzerkl%C3%A4rung+der+georg-august-universit%C3%A4t+g%C3%B6ttingen/439479.html" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="external-link"
                 tabIndex={2}>
                <strong>Datenschutzerklärung der Uni Göttingen</strong>
              </a>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPage;
