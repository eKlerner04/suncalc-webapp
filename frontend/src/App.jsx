import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

    
import Header from './components/Header';
import SolarCalculator from './components/SolarCalculator';
import Footer from './components/Footer';
import AccessibilityPage from './components/AccessibilityPage';
import PrivacyPage from './components/PrivacyPage';

export default function App() {
  return (
    <Router>
      <div className="layout">
        <Header />
        
        <main className="main" style={{ paddingTop: '200px' }}>
          <Routes>
            <Route path="/" element={<SolarCalculator />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}


