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

    // Add Main Campus Anchor Marker
    const campusIcon = L.divIcon({
      className: 'custom-campus-marker',
      html: `<div style="background-color: #ff385c; color: white; border: 2px solid white; border-radius: 9999px; padding: 6px 10px; font-weight: bold; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); white-space: nowrap; display: flex; align-items: center; gap: 4px;">🎓 Main Campus</div>`,
      iconSize: [110, 30],
      iconAnchor: [55, 15],
    });
    const campusMarker = L.marker([28.5135, 77.0422], { icon: campusIcon }).addTo(map);
    campusMarker.bindPopup(`<b>University Main Campus</b><br>Student Housing Corridor`);
    markersRef.current.push(campusMarker);

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
          <h1 className="font-heading text-2xl font-bold text-[#222222] tracking-tight">
            Student Safety & Locality Risk Map
          </h1>
          <p className="text-xs text-[#6a6a6a] mt-1">
            Real-world locality risk assessments, night street lighting, and campus commute times.
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#ebebeb] rounded-full shadow-subtle">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'all'
                ? 'bg-[#222222] text-white shadow-xs'
                : 'text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            All Risk Data
          </button>
          <button
            onClick={() => setActiveLayer('night')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'night'
                ? 'bg-[#222222] text-white shadow-xs'
                : 'text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            Night Lighting
          </button>
          <button
            onClick={() => setActiveLayer('transit')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'transit'
                ? 'bg-[#222222] text-white shadow-xs'
                : 'text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            Transit & Shuttle
          </button>
        </div>
      </div>

      {/* Map + Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Area (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#ebebeb] overflow-hidden shadow-subtle flex flex-col h-[520px]">
          {/* Quick Locality Bar */}
          <div className="p-3 bg-[#f7f7f7] border-b border-[#ebebeb] flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-[#6a6a6a] px-2 shrink-0">
              Zones:
            </span>
            {localities.map((loc) => {
              const isSelected = active.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => handleSelectLocality(loc)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#222222] text-white shadow-xs'
                      : 'bg-white text-[#222222] border border-[#ebebeb] hover:border-[#222222]'
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
          <div className="px-4 py-2 bg-white border-t border-[#ebebeb] flex items-center justify-between text-xs text-[#6a6a6a]">
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
              OpenStreetMap Campus Grid
            </span>
          </div>
        </div>

        {/* Locality Detailed Inspection Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#ebebeb] p-6 shadow-subtle space-y-5 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#ebebeb]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-bold text-[#222222]">
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
                <p className="text-xs text-[#6a6a6a] mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#ff385c]" /> Commute: {active.ncuCommuteTime} ({active.distanceToNCUKm} km to Campus)
                </p>
              </div>

              <div className="text-center bg-[#f7f7f7] p-2.5 rounded-2xl border border-[#ebebeb]">
                <div className="text-2xl font-heading font-bold text-[#ff385c]">
                  {active.safetyScore}
                </div>
                <div className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider">
                  Safety Index
                </div>
              </div>
            </div>

            {/* Metric Gauges */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-[#f7f7f7] rounded-2xl border border-[#ebebeb] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a6a6a] flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-[#f59e0b]" /> Night Street Lighting
                </span>
                <div className="text-base font-bold text-[#222222]">
                  {active.streetLightingScore} / 100
                </div>
                <div className="w-full bg-[#ebebeb] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#f59e0b] h-full"
                    style={{ width: `${active.streetLightingScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-[#f7f7f7] rounded-2xl border border-[#ebebeb] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a6a6a] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#ff385c]" /> Police Chowki
                </span>
                <div className="text-xs font-bold text-[#222222] line-clamp-1">
                  {active.nearestPoliceStation}
                </div>
                <span className="text-[10px] text-[#6a6a6a] block">
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
            <div className="mt-3 text-xs text-[#6a6a6a]">
              <span className="font-semibold text-[#222222] flex items-center gap-1 mb-1">
                <Bus className="w-3.5 h-3.5 text-[#ff385c]" /> Key Transit Hubs:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {active.transitPoints.map((tp, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#f7f7f7] border border-[#ebebeb] rounded-md text-[11px]"
                  >
                    {tp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-3 border-t border-[#ebebeb] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#6a6a6a] uppercase font-bold block">
                Average 2BHK Student Rent
              </span>
              <span className="text-sm font-bold text-[#222222]">
                ₹{active.medianRent2BHK.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <button
              onClick={() => setActiveTab('discover')}
              className="px-4 py-2 bg-[#ff385c] hover:bg-[#e00b41] text-white shadow-xs text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Browse Flats in {active.name.split(' ')[0]} &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
