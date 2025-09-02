import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMemo } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Leaflet Icon-Konfiguration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Komponenten importieren
import Header from './components/Header';
import SolarCalculator from './components/SolarCalculator';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="layout">
      <Header />
      
      <main className="main" style={{ paddingTop: '200px' }}>
        <SolarCalculator />
      </main>
      
      <Footer />
    </div>
  );
}


