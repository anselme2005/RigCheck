import { Route, Routes } from "react-router-dom";

import SiteHeader from "./components/SiteHeader.jsx";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

/**
 * The root application owns the shared header and route definitions.
 * Individual pages own their page-specific content.
 */
export default function App() {
  return (
    <>
      <SiteHeader />

      <Routes>
        {/* Main game discovery experience. */}
        <Route path="/" element={<HomePage />} />

        {/* Individual game detail pages use the game's URL slug. */}
        <Route path="/games/:slug" element={<GamePage />} />

        {/* Any URL that does not match a registered route. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}