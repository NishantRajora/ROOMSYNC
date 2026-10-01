import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Clock, Phone, MapPin, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface SosCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

export const SosCheckinModal: React.FC<SosCheckinModalProps> = ({
  isOpen,
  onClose,
  defaultDestination = '',
}) => {
  const { activeVisitAlert, startVisitAlert, cancelVisitAlert, triggerEmergencyAlert } = useApp();

  const [destination, setDestination] = useState(defaultDestination || 'Flat 412, Block C, Sector 23, Gurugram');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [contactName, setContactName] = useState('Priya Sharma (Sister)');
  const [contactPhone, setContactPhone] = useState('+91 98112 99887');

  if (!isOpen) return null;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startVisitAlert(destination, durationMinutes, contactName, contactPhone);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ece9] bg-gradient-to-r from-[#117c74]/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#117c74]/10 text-[#117c74]">
              <ShieldAlert className="w-5 h-5 text-[#117c74]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#17222b]">
                SOS Safety Visit Check-in
              </h3>
              <p className="text-xs text-[#5f7572]">
                Automated safety countdown for flat viewings in NCR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5f7572] hover:text-[#17222b] hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeVisitAlert ? (
            <div className="text-center space-y-6">
              {activeVisitAlert.status === 'alert_triggered' ? (
                <div className="p-4 bg-[#f43f5e]/10 border border-[#f43f5e]/30 rounded-2xl text-left space-y-3 animate-pulse">
                  <div className="flex items-center gap-2 text-[#f43f5e] font-bold">
                    <AlertTriangle className="w-5 h-5" />
                    <span>EMERGENCY SOS BROADCAST ACTIVE</span>
                  </div>
                  <p className="text-sm text-[#17222b]">
                    Check-in window expired! Automated alert dispatched to{' '}
                    <strong className="font-semibold">{activeVisitAlert.emergencyContactName}</strong> (
                    {activeVisitAlert.emergencyContactPhone}) with your destination:
                  </p>
                  <p className="text-xs font-mono-code bg-white p-2.5 rounded-lg border border-[#f43f5e]/20 text-[#17222b]">
                    📍 {activeVisitAlert.destination}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={`tel:${activeVisitAlert.emergencyContactPhone}`}
                      className="flex-1 py-2 px-3 text-center bg-[#f43f5e] text-white font-medium rounded-xl text-sm hover:bg-[#e11d48] transition-colors"
                    >
                      Call Contact
                    </a>
                    <a
                      href="tel:112"
                      className="py-2 px-4 text-center bg-black text-white font-medium rounded-xl text-sm hover:bg-neutral-800 transition-colors"
                    >
                      Call 112
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center p-6 rounded-full bg-[#117c74]/10 border-4 border-[#117c74]/20">
                    <div className="text-4xl font-mono-code font-bold text-[#117c74]">
                      {formatTime(activeVisitAlert.remainingSeconds)}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-semibold text-lg text-[#17222b]">
                      Visit in Progress
                    </h4>
                    <p className="text-xs text-[#5f7572] mt-1 flex items-center justify-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#117c74]" />
                      {activeVisitAlert.destination}
                    </p>
                    <p className="text-xs text-[#5f7572] mt-0.5">
                      Emergency Contact: {activeVisitAlert.emergencyContactName} ({activeVisitAlert.emergencyContactPhone})
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    cancelVisitAlert();
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-5 h-5" />
                  I'm Safe — End Visit
                </button>

                {activeVisitAlert.status !== 'alert_triggered' && (
                  <button
                    onClick={triggerEmergencyAlert}
                    className="w-full py-2 px-4 text-xs text-[#f43f5e] hover:bg-[#f43f5e]/10 rounded-xl transition-colors font-medium cursor-pointer"
                  >
                    Test / Trigger Immediate SOS Alert
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5">
                  Property Viewing Destination
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#5f7572]" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. House 412, Sector 23, Gurugram"
                    className="w-full pl-9.5 pr-3 py-2.5 text-sm bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5">
                  Estimated Viewing Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                        durationMinutes === mins
                          ? 'bg-[#117c74] text-white border-[#117c74] shadow-xs'
                          : 'bg-[#f6f9f8] text-[#17222b] border-[#e2ece9] hover:bg-white'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Friend or family"
                    className="w-full px-3 py-2 text-sm bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f7572] mb-1.5">
                    Emergency Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5f7572]" />
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs text-[#065f46] flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                <span>
                  If you do not tap "I'm Safe" before the timer expires, RoomSync will trigger a missed check-in alert to your emergency contact.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#117c74] hover:bg-[#0d635c] text-white font-semibold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                Start Safe Visit Timer ({durationMinutes}m)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
