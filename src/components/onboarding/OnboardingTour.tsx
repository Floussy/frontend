import { useMemo } from "react";
import { Joyride, STATUS } from "react-joyride";
import type { Step, EventData } from "react-joyride";
import { useTranslation } from "react-i18next";
import { useTheme, useMediaQuery } from "@mui/material";
import { useAppStore } from "../../store/appStore";
import OnboardingTooltip from "./OnboardingTooltip";

export default function OnboardingTour({
  run,
  onComplete,
}: {
  run: boolean;
  onComplete: () => void;
}) {
  const { t } = useTranslation("onboarding");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const isDark = theme.palette.mode === "dark";
  const { setSidebarOpen } = useAppStore();

  // Dashboard steps — visible on all devices
  const dashboardSteps: Step[] = [
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
  ];

  // Sidebar nav steps — only on desktop (sidebar is always visible)
  const sidebarSteps: Step[] = [
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
      target: '[data-tour="nav-feedback"]',
      title: t("feedback.title"),
      content: t("feedback.content"),
      placement: "right",
    },
    {
      target: '[data-tour="nav-settings"]',
      title: t("settings.title"),
      content: t("settings.content"),
      placement: "right",
    },
  ];

  // On mobile, replace sidebar steps with a single centered summary
  const mobileNavSummary: Step[] = [
    {
      target: "body",
      placement: "center",
      title: t("mobileNav.title"),
      content: t("mobileNav.content"),
      skipBeacon: true,
    },
  ];

  const doneStep: Step = {
    target: "body",
    placement: "center",
    title: t("done.title"),
    content: t("done.content"),
    skipBeacon: true,
  };

  const steps = useMemo(() => {
    const navSteps = isMobile ? mobileNavSummary : sidebarSteps;
    return [...dashboardSteps, ...navSteps, doneStep];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, t]);

  function handleEvent(data: EventData) {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      setSidebarOpen(false);
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
      tooltipComponent={OnboardingTooltip}
      locale={{
        back: t("controls.back"),
        close: t("controls.close"),
        last: t("controls.finish"),
        next: t("controls.next"),
        skip: t("controls.skip"),
      }}
      options={{
        primaryColor: theme.palette.primary.main,
        overlayColor: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
        backgroundColor: theme.palette.background.paper,
        textColor: theme.palette.text.primary,
        arrowColor: theme.palette.background.paper,
        showProgress: true,
        zIndex: 10000,
        spotlightRadius: 8,
      }}
    />
  );
}
