import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationToast } from "@/components/game/NotificationToast";
import Home from "@/pages/Home";
import Chapters from "@/pages/Chapters";
import ChapterPlay from "@/pages/ChapterPlay";
import Mailbox from "@/pages/Mailbox";
import StarMap from "@/pages/StarMap";
import Characters from "@/pages/Characters";
import CharacterDetail from "@/pages/CharacterDetail";
import Inventory from "@/pages/Inventory";
import ChoicesRecord from "@/pages/ChoicesRecord";
import EndingsGallery from "@/pages/EndingsGallery";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <Router>
      <NotificationToast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/chapters/:id" element={<ChapterPlay />} />
        <Route path="/mailbox" element={<Mailbox />} />
        <Route path="/starmap" element={<StarMap />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/choices" element={<ChoicesRecord />} />
        <Route path="/endings" element={<EndingsGallery />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
