import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationToast } from "@/components/game/NotificationToast";
import { RandomEventModal } from "@/components/game/RandomEventModal";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useGameStore } from "@/store/gameStore";
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

function AppContent() {
  const { initSave, checkAndTriggerMails, checkEndingUnlocks } = useGameStore();
  useBackgroundMusic();

  useEffect(() => {
    initSave();

    setTimeout(() => {
      checkAndTriggerMails();
      checkEndingUnlocks();
    }, 500);
  }, [initSave, checkAndTriggerMails, checkEndingUnlocks]);

  return (
    <>
      <NotificationToast />
      <RandomEventModal />
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
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
