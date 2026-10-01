import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SafetyLocality } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Clock,
  Compass,
  AlertTriangle,
  Lightbulb,
  Bus,
  CheckCircle,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import L from 'leaflet';

export const SafetyMapPage: React.FC = () => {
  const { localities, selectedLocality, setSelectedLocality, setActiveTab } = useApp();
  const [activeLayer, setActiveLayer] = useState<'all' | 'night' | 'transit'>('all');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const active = selectedLocality || localities[0];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center around NCU Gurugram (28.5135, 77.0422)
      const map = L.map(mapContainerRef.current, {
        center: [28.508, 77.058],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add NCU Campus Anchor Marker
    const ncuIcon = L.divIcon({
      className: 'custom-ncu-marker',
      html: `<div style="background-color: #117c74; color: white; border: 2px solid white; border-radius: 9999px; padding: 6px 10px; font-weight: bold; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); white-space: nowrap; display: flex; align-items: center; gap: 4px;">🎓 NCU Campus</div>`,
      iconSize: [110, 30],
      iconAnchor: [55, 15],
    });
    const ncuMarker = L.marker([28.5135, 77.0422], { icon: ncuIcon }).addTo(map);
    ncuMarker.bindPopup(`<b>The NorthCap University (NCU)</b><br>HUDA Sector 23A, Gurugram`);
    markersRef.current.push(ncuMarker);

    // Add locality markers
    localities.forEach((loc) => {
      const color =
        loc.riskLevel === 'low'
          ? '#10b981'
          : loc.riskLevel === 'medium'
          ? '#f59e0b'
          : '#f43f5e';

      const customIcon = L.divIcon({
        className: 'custom-locality-marker',
        html: `
          <div style="background-color: ${color}; color: white; border: 2px solid white; border-radius: 12px; padding: 4px 8px; font-size: 11px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.25); white-space: nowrap; cursor: pointer; display: flex; align-items: center; gap: 4px;">
            <span>${loc.name.split(' ')[0]}</span>
            <span style="background: rgba(0,0,0,0.2); padding: 1px 4px; border-radius: 6px;">${loc.safetyScore}</span>
          </div>
        `,
        iconSize: [80, 26],
        iconAnchor: [40, 13],
      });

      const marker = L.marker(loc.coordinates, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedLocality(loc);
      });

      markersRef.current.push(marker);
    });

    return () => {
      // clean up if component unmounts
    };
  }, [localities]);

  // Center on selected locality when clicked
  const handleSelectLocality = (loc: SafetyLocality) => {
    setSelectedLocality(loc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(loc.coordinates, 14, {
        duration: 1.2,
      });
    }
  };

  const getRiskColor = (risk: SafetyLocality['riskLevel']) => {
    if (risk === 'low') return 'text-[#10b981] bg-[#ecfdf5] border-[#a7f3d0]';
    if (risk === 'medium') return 'text-[#f59e0b] bg-[#fffbeb] border-[#fde68a]';
    return 'text-[#f43f5e] bg-[#fef2f2] border-[#fecdd3]';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#17222b] tracking-tight">
            Gurugram Student Safety & Locality Map
          </h1>
          <p className="text-xs text-[#5f7572] mt-1">
            Real-world locality risk assessments, night street lighting, and NCU campus commute times.
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#e2ece9] rounded-2xl shadow-2xs">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'all'
                ? 'bg-[#117c74] text-white shadow-2xs'
                : 'text-[#5f7572] hover:text-[#17222b]'
            }`}
          >
            All Risk Data
          </button>
          <button
            onClick={() => setActiveLayer('night')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'night'
                ? 'bg-[#117c74] text-white shadow-2xs'
                : 'text-[#5f7572] hover:text-[#17222b]'
            }`}
          >
            Night Lighting
          </button>
          <button
            onClick={() => setActiveLayer('transit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'transit'
                ? 'bg-[#117c74] text-white shadow-2xs'
                : 'text-[#5f7572] hover:text-[#17222b]'
            }`}
          >
            Transit & Shuttle
          </button>
        </div>
      </div>

      {/* Map + Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Area (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e2ece9] overflow-hidden shadow-2xs flex flex-col h-[520px]">
          {/* Quick Locality Bar */}
          <div className="p-3 bg-[#f6f9f8] border-b border-[#e2ece9] flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-[#5f7572] px-2 shrink-0">
              Zones:
            </span>
            {localities.map((loc) => {
              const isSelected = active.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => handleSelectLocality(loc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#117c74] text-white shadow-xs'
                      : 'bg-white text-[#17222b] border border-[#e2ece9] hover:bg-[#e2ece9]'
                  }`}
                >
                  {loc.name.split(' ')[0]} ({loc.safetyScore})
                </button>
              );
            })}
          </div>

          {/* Leaflet Map Canvas */}
          <div ref={mapContainerRef} className="flex-1 w-full h-full z-10" />

          {/* Legend Footer */}
          <div className="px-4 py-2 bg-white border-t border-[#e2ece9] flex items-center justify-between text-xs text-[#5f7572]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Low Risk (80+)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Moderate (65-79)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" /> Exercise Caution
              </span>
            </div>
            <span className="font-mono-code text-[11px] hidden sm:inline">
              OpenStreetMap NCU Grid
            </span>
          </div>
        </div>

        {/* Locality Detailed Inspection Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e2ece9] p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#e2ece9]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-bold text-[#17222b]">
                    {active.name}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskColor(
                      active.riskLevel
                    )}`}
                  >
                    {active.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-xs text-[#5f7572] mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#117c74]" /> Commute: {active.ncuCommuteTime} ({active.distanceToNCUKm} km to NCU)
                </p>
              </div>

              <div className="text-center bg-[#f6f9f8] p-2.5 rounded-2xl border border-[#e2ece9]">
                <div className="text-2xl font-heading font-bold text-[#117c74]">
                  {active.safetyScore}
                </div>
                <div className="text-[10px] font-bold text-[#5f7572] uppercase tracking-wider">
                  Safety Index
                </div>
              </div>
            </div>

            {/* Metric Gauges */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f7572] flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-[#f59e0b]" /> Night Street Lighting
                </span>
                <div className="text-base font-bold text-[#17222b]">
                  {active.streetLightingScore} / 100
                </div>
                <div className="w-full bg-[#e2ece9] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#f59e0b] h-full"
                    style={{ width: `${active.streetLightingScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-[#f6f9f8] rounded-2xl border border-[#e2ece9] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f7572] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#117c74]" /> Police Chowki
                </span>
                <div className="text-xs font-bold text-[#17222b] line-clamp-1">
                  {active.nearestPoliceStation}
                </div>
                <span className="text-[10px] text-[#5f7572] block">
                  Student Density: {active.studentDensity}
                </span>
              </div>
            </div>

            {/* Key Safety Highlights */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#065f46] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
                Student Safety Highlights
              </span>
              <div className="space-y-1.5">
                {active.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="text-xs text-[#065f46] bg-[#ecfdf5] p-2.5 rounded-xl border border-[#a7f3d0] leading-relaxed"
                  >
                    • {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Caution advisories if any */}
            {active.cautionNotes && active.cautionNotes.length > 0 && (
              <div className="space-y-1.5 mt-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#92400e] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
                  Advisories & Caution Areas
                </span>
                {active.cautionNotes.map((c, i) => (
                  <div
                    key={i}
                    className="text-xs text-[#92400e] bg-[#fffbeb] p-2.5 rounded-xl border border-[#fde68a] leading-relaxed"
                  >
                    ⚠️ {c}
                  </div>
                ))}
              </div>
            )}

            {/* Transit Points */}
            <div className="mt-3 text-xs text-[#5f7572]">
              <span className="font-semibold text-[#17222b] flex items-center gap-1 mb-1">
                <Bus className="w-3.5 h-3.5 text-[#117c74]" /> Key Transit Hubs:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {active.transitPoints.map((tp, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#f6f9f8] border border-[#e2ece9] rounded-md text-[11px]"
                  >
                    {tp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-3 border-t border-[#e2ece9] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#5f7572] uppercase font-bold block">
                Average 2BHK Student Rent
              </span>
              <span className="text-sm font-bold text-[#17222b]">
                ₹{active.medianRent2BHK.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <button
              onClick={() => setActiveTab('discover')}
              className="px-4 py-2 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Browse Flats in {active.name.split(' ')[0]} &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
