import { createBrowserRouter } from "react-router";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import GuestRoute from "./components/layout/GuestRoute";

// Public pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// App pages (protected)
import Dashboard from "./pages/app/Dashboard";
import Incomes from "./pages/app/Incomes";
import Expenses from "./pages/app/Expenses";
import Goals from "./pages/app/Goals";
import Budgets from "./pages/app/Budgets";
import Reports from "./pages/app/Reports";
import Settings from "./pages/app/Settings";
import Profile from "./pages/app/Profile";
import Recurring from "./pages/app/Recurring";
import Feedback from "./pages/app/Feedback";
import Accounts from "./pages/app/Accounts";
import Subscriptions from "./pages/app/Subscriptions";
import SharedBudgets from "./pages/app/SharedBudgets";
import SharedBudgetDetail from "./pages/app/SharedBudgetDetail";

export const router = createBrowserRouter([
  // Public pages with navbar + footer
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
    ],
  },

  // Auth pages (guest only — redirect to dashboard if logged in)
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password", element: <ResetPassword /> },
        ],
      },
    ],
  },

  // Protected app pages (require auth)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "incomes", element: <Incomes /> },
          { path: "expenses", element: <Expenses /> },
          { path: "recurring", element: <Recurring /> },
          { path: "goals", element: <Goals /> },
          { path: "budgets", element: <Budgets /> },
          { path: "reports", element: <Reports /> },
          { path: "settings", element: <Settings /> },
          { path: "profile", element: <Profile /> },
          { path: "feedback", element: <Feedback /> },
          { path: "accounts", element: <Accounts /> },
          { path: "subscriptions", element: <Subscriptions /> },
          { path: "shared-budgets", element: <SharedBudgets /> },
          { path: "shared-budgets/:id", element: <SharedBudgetDetail /> },
        ],
      },
    ],
  },
]);
