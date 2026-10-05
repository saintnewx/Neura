import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import AppPage from "./pages/AppPage";
import NotFound from "./pages/NotFound";

// Restore scroll position and support section links across routes.
function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

// Public routes and the catch-all page.
export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
