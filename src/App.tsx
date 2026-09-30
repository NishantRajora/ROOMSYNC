import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Verify from "./pages/Verify";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import MatchFeed from "./pages/MatchFeed";
import ListingDiscovery from "./pages/ListingDiscovery";
import ListingDetail from "./pages/ListingDetail";
import SafetyMap from "./pages/SafetyMap";
import BillSplitter from "./pages/BillSplitter";
import RoommatePact from "./pages/RoommatePact";
import AgreementAnalyzer from "./pages/AgreementAnalyzer";
import SOSVisit from "./pages/SOSVisit";
import Reviews from "./pages/Reviews";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* App shell routes (authenticated) */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matches" element={<MatchFeed />} />
          <Route path="/listings" element={<ListingDiscovery />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/safety-map" element={<SafetyMap />} />
          <Route path="/bills" element={<BillSplitter />} />
          <Route path="/pact" element={<RoommatePact />} />
          <Route path="/agreement" element={<AgreementAnalyzer />} />
          <Route path="/sos" element={<SOSVisit />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
