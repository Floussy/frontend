import { useState, useEffect } from "react";

const TOUR_COMPLETED_KEY = "floussy_tour_completed";

export function useOnboardingTour(shouldRun: boolean) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (shouldRun && !localStorage.getItem(TOUR_COMPLETED_KEY)) {
      // Wait for dashboard elements to render
      const timer = setTimeout(() => {
        const header = document.querySelector('[data-tour="user-header"]');
        if (header) {
          setRun(true);
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [shouldRun]);

  function completeTour() {
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    setRun(false);
  }

  return { run, setRun, completeTour };
}
