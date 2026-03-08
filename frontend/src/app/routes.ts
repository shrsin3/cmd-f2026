import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import Home from "./pages/Home";
import TasksPage from "./pages/TasksPage";
import TimerPage from "./pages/TimerPage";
import WrapUpPage from "./pages/WrapUpPage";
import ReportPage from "./pages/ReportPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/setup",
    Component: SetupPage,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/tasks",
    Component: TasksPage,
  },
  {
    path: "/timer",
    Component: TimerPage,
  },
  {
    path: "/wrap-up",
    Component: WrapUpPage,
  },
  {
    path: "/report",
    Component: ReportPage,
  },
]);