import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AccessibilityPage.css';

const AccessibilityPage = () => {
  // Langsames scrollen
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
    <div className="accessibility-page">
      <div className="accessibility-container">
        <div className="accessibility-nav">
          <Link to="/" className="back-link" tabIndex={1}>← Zurück zur Hauptseite</Link>
          <h1>Barrierefreiheit</h1>
        </div>

        <main className="accessibility-content">
          <section className="impairment-section">
            <h2>Visuelle Beeinträchtigung</h2>
            <ul>
              <li>
                <strong>Kontrastverhältnisse:</strong> Alle Texte und UI-Elemente erfüllen WCAG 2.1 AA-Standard (4.5:1 Kontrastverhältnis)
              </li>
              <li>
                <strong>Skalierung:</strong> Responsive Design ermöglicht Zoom bis 200% ohne Funktionsverlust
              </li>
              <li>
                <strong>Farbunabhängigkeit:</strong> Informationen werden nicht über Farbe vermittelt (z.B. Kompass-Richtungen mit starken Rahmen)
              </li>
            </ul>
          </section>

          <section className="impairment-section">
            <h2>Motorische Beeinträchtigung</h2>
            <ul>
              <li>
                <strong>Tastaturnavigation:</strong> Alle Funktionen sind über Tastatur erreichbar (TAB-Funktion)
              </li>
              <li>
                <strong>Slider-Bedienung:</strong> Dachneigung kann über Tastatur eingestellt werden (Pfeiltasten)
              </li>
              <li>
                <strong>Touch-Targets:</strong> Mindestgröße 44px x 44px für alle klickbaren Elemente
              </li>
            </ul>
          </section>

          <section className="impairment-section">
            <h2>Kognitive Beeinträchtigung</h2>
            <ul>
              <li>
                <strong>Klare Navigation:</strong> Menüstruktur mit nummeriertem Ablauf (1. Standort wählen, 2. Dachparameter, 3. Ergebnisse anzeigen)
              </li>
              <li>
                <strong>Einfache Sprache:</strong> Verständliche Beschriftungen und Anweisungen
              </li>
              <li>
                <strong>Konsistente Bedienung:</strong> Einheitliche Interaktionsmuster
              </li>
            </ul>
          </section>

          <section className="standards-section">
            <h2>Berücksichtigte Standards</h2>
            <ul>
              <li><strong>WCAG 2.1 AA:</strong> Vollständig implementiert</li>
              <li><strong>Screen Reader Support:</strong> ARIA-Labels und semantische HTML-Elemente</li>
              <li><strong>High Contrast Mode:</strong> Unterstützung für hohe Kontraste</li>
            </ul>
          </section>

          <section className="navigation-help">
            <h2>Tastaturnavigation</h2>
            <p>Die Anwendung ist vollständig per Tastatur bedienbar:</p>
            <ul>
              <li><strong>Tab:</strong> Durch alle Elemente navigieren</li>
              <li><strong>Enter/Space:</strong> Elemente aktivieren</li>
              <li><strong>Pfeiltasten:</strong> Slider bedienen</li>
            </ul>
          </section>

          <section className="contact-section">
            <h2>Kontakt</h2>
            <p>
              <strong>E-Mail:</strong> e.klerner@stud.uni-goettingen.de
            </p>
            <p>
              <a href="https://www.uni-goettingen.de/de/635204.html" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="external-link"
                 tabIndex={2}>
                <strong>Barrierefreiheit der Uni Göttingen</strong>
              </a>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AccessibilityPage;
