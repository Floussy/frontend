import { useState, useEffect } from "react";
import { Joyride, STATUS } from "react-joyride";
import type { Step, EventData } from "react-joyride";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";

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

export default function OnboardingTour({
  run,
  onComplete,
}: {
  run: boolean;
  onComplete: () => void;
}) {
  const { t } = useTranslation("onboarding");
  const theme = useTheme();

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      title: t("welcome.title"),
      content: t("welcome.content"),
      skipBeacon: true,
    },
    {
      target: '[data-tour="user-header"]',
      title: t("header.title"),
      content: t("header.content"),
      placement: "bottom",
    },
    {
      target: '[data-tour="quick-actions"]',
      title: t("quickActions.title"),
      content: t("quickActions.content"),
      placement: "bottom",
    },
    {
      target: '[data-tour="summary-cards"]',
      title: t("summaryCards.title"),
      content: t("summaryCards.content"),
      placement: "bottom",
    },
    {
      target: '[data-tour="chart"]',
      title: t("chart.title"),
      content: t("chart.content"),
      placement: "top",
    },
    {
      target: '[data-tour="history-table"]',
      title: t("history.title"),
      content: t("history.content"),
      placement: "top",
    },
    {
      target: '[data-tour="nav-incomes"]',
      title: t("incomes.title"),
      content: t("incomes.content"),
      placement: "right",
    },
    {
      target: '[data-tour="nav-expenses"]',
      title: t("expenses.title"),
      content: t("expenses.content"),
      placement: "right",
    },
    {
      target: '[data-tour="nav-recurring"]',
      title: t("recurring.title"),
      content: t("recurring.content"),
      placement: "right",
    },
    {
      target: '[data-tour="nav-goals"]',
      title: t("goals.title"),
      content: t("goals.content"),
      placement: "right",
    },
    {
      target: '[data-tour="nav-budgets"]',
      title: t("budgets.title"),
      content: t("budgets.content"),
      placement: "right",
    },
    {
      target: '[data-tour="nav-reports"]',
      title: t("reports.title"),
      content: t("reports.content"),
      placement: "right",
    },
    {
      target: '[data-tour="nav-settings"]',
      title: t("settings.title"),
      content: t("settings.content"),
      placement: "right",
    },
    {
      target: "body",
      placement: "center",
      title: t("done.title"),
      content: t("done.content"),
    },
  ];

  function handleEvent(data: EventData) {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      onComplete();
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      locale={{
        back: t("controls.back"),
        close: t("controls.close"),
        last: t("controls.finish"),
        next: t("controls.next"),
        skip: t("controls.skip"),
      }}
      options={{
        primaryColor: theme.palette.primary.main,
        overlayColor: "rgba(0, 0, 0, 0.5)",
        backgroundColor: "#fff",
        textColor: theme.palette.text.primary,
        arrowColor: "#fff",
        showProgress: true,
        zIndex: 10000,
      }}
    />
  );
}
