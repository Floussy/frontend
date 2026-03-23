import { useState, useEffect } from "react";

const TOUR_COMPLETED_KEY = "floussy_tour_completed";

export function useOnboardingTour(isNewUser: boolean) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (isNewUser && !localStorage.getItem(TOUR_COMPLETED_KEY)) {
      const timer = setTimeout(() => setRun(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isNewUser]);

  function completeTour() {
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    setRun(false);
  }

  return { run, setRun, completeTour };
}
