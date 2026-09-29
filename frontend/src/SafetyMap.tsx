import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

export interface SafetyMapProps {
  safety: any;
  listings: any[];
  onNotify: (msg: string) => void;
}

const NCU_COORDS: L.LatLngTuple = [28.5037, 77.0504];

const LOCALITY_COORDS: Record<string, [number, number]> = {
  "Sector 23": [28.5085, 77.0375],
  "Sector 40": [28.4526, 77.0601],
  "Sushant Lok": [28.4682, 77.0815],
  "DLF Phase 3": [28.4912, 77.0945],
  "Palam Vihar": [28.5080, 77.0280],
  "South City 1": [28.4600, 77.0580],
  "Sector 57": [28.4285, 77.0780],
  "Golf Course Road": [28.4715, 77.1020],
  "Nirvana Country": [28.4120, 77.0620],
  "MG Road": [28.4800, 77.0800],
};

const DEFAULT_AMENITIES = [
  { type: "police", name: "Sector 23 Police Station", lat: 28.5050, lng: 77.0350 },
  { type: "hospital", name: "Columbia Asia / Manipal Hospital", lat: 28.5015, lng: 77.0420 },
  { type: "metro", name: "MG Road Metro Station", lat: 28.4795, lng: 77.0805 },
];

export const SafetyMap: React.FC<SafetyMapProps> = ({ safety, listings, onNotify }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    leafletMap.current = L.map(mapRef.current).setView(NCU_COORDS, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap.current);

    const map = leafletMap.current;

    // Custom icons
    const createIcon = (color: string) => L.divIcon({
      className: 'safety-map-marker',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const uniIcon = createIcon('#183d3a');
    const policeIcon = createIcon('#c53030');
    const hospitalIcon = createIcon('#276749');
    const metroIcon = createIcon('#dd6b20');
    const listingIcon = createIcon('#117c74');

    // Campus marker
    L.marker(NCU_COORDS, { icon: uniIcon })
      .addTo(map)
      .bindPopup('<b>The NorthCap University (NCU)</b><br/>Campus Pilot Anchor');

    // Amenity markers
    const amenitiesToRender = safety?.amenities || DEFAULT_AMENITIES;
    amenitiesToRender.forEach((amenity: any) => {
      let icon = policeIcon;
      if (amenity.type === 'hospital') icon = hospitalIcon;
      if (amenity.type === 'metro') icon = metroIcon;

      const lat = amenity.lat || (amenity.type === 'police' ? 28.5050 : amenity.type === 'hospital' ? 28.5015 : 28.4795);
      const lng = amenity.lng || (amenity.type === 'police' ? 77.0350 : amenity.type === 'hospital' ? 77.0420 : 77.0805);

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<b>${amenity.name || amenity.type.toUpperCase()}</b><br/>${amenity.type}`);
    });

    // Listing markers
    listings.forEach((listing, index) => {
      let lat = listing.lat;
      let lng = listing.lng;
      if (!lat || !lng) {
        const base = LOCALITY_COORDS[listing.locality] || [28.4595, 77.0266];
        const offsetLat = ((index % 5) - 2) * 0.003;
        const offsetLng = (((index * 3) % 5) - 2) * 0.003;
        lat = base[0] + offsetLat;
        lng = base[1] + offsetLng;
      }

      const trustScore = listing.trust?.score ?? listing.trust_score ?? 85;
      L.marker([lat, lng], { icon: listingIcon })
        .addTo(map)
        .bindPopup(
          `<b>${listing.title || 'Room Listing'}</b><br/>${listing.locality || 'Gurugram'}<br/>Rent: ₹${Number(listing.rent).toLocaleString()}/mo<br/>Trust Score: ${trustScore}/100`
        );
    });

    // Risk zone circle
    if (safety?.geo_risk_score) {
      const radius = safety.geo_risk_score * 100; // arbitrary scaling for visual
      L.circle(NCU_COORDS, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.2,
        radius: radius,
      }).addTo(map)
        .bindPopup(`Risk Zone (Score: ${safety.geo_risk_score})`);
    }

    // Legend
    const legend = new L.Control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'safety-map-legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.border = '1px solid #ccc';
      div.style.borderRadius = '4px';

      div.innerHTML = `
        <h4 style="margin: 0 0 5px 0;">Legend</h4>
        <div style="margin-bottom: 3px;"><span style="display:inline-block; width:12px; height:12px; background:blue; border-radius:50%; margin-right:5px;"></span> NCU Campus</div>
        <div style="margin-bottom: 3px;"><span style="display:inline-block; width:12px; height:12px; background:teal; border-radius:50%; margin-right:5px;"></span> Listing</div>
        <div style="margin-bottom: 3px;"><span style="display:inline-block; width:12px; height:12px; background:red; border-radius:50%; margin-right:5px;"></span> Police</div>
        <div style="margin-bottom: 3px;"><span style="display:inline-block; width:12px; height:12px; background:green; border-radius:50%; margin-right:5px;"></span> Hospital</div>
        <div style="margin-bottom: 3px;"><span style="display:inline-block; width:12px; height:12px; background:orange; border-radius:50%; margin-right:5px;"></span> Metro</div>
      `;
      return div;
    };
    legend.addTo(map);

    return () => {
      map.remove();
    };
  }, [safety, listings]);

  return (
    <div
      className="safety-map-container"
      ref={mapRef}
      style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}
    />
  );
};
