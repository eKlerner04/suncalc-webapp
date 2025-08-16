import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMemo } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function App() {
  return (
    <div className="layout">
      <header className="header">
        <h1 className="title">SunCalc</h1>
        <p className="subtitle">Berechne das Solarpotential deines Dachs.</p>
      </header>

      <main className="main">
        <section className="card">
          <h2>Test</h2>
          <p>Test Text</p>
        </section>
      </main>

      <footer className="footer">
        <a href="https://www.uni-goettingen.de/de/impressum/43.html" target="_blank" rel="noreferrer">
          Impressum
        </a>
        {" · "}
        <a href="https://www.uni-goettingen.de/de/datenschutz/3240.html" target="_blank" rel="noreferrer">
          Datenschutzerklärung
        </a>
      </footer>
    </div>
  );
}


