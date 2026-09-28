import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function GoogleAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    console.log("GA4 PAGE VIEW:", location.pathname);

    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
}
