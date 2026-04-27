import { createBrowserRouter } from "react-router";
import { Layout } from "./components/voip/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ActiveCalls } from "./pages/ActiveCalls";
import { Extensions } from "./pages/Extensions";
import { CallHistory } from "./pages/CallHistory";
import { VoicemailPage } from "./pages/Voicemail";
import { Conference } from "./pages/Conference";
import { IVR } from "./pages/IVR";
import { Security } from "./pages/Security";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "active-calls", Component: ActiveCalls },
      { path: "extensions", Component: Extensions },
      { path: "history", Component: CallHistory },
      { path: "voicemail", Component: VoicemailPage },
      { path: "conference", Component: Conference },
      { path: "ivr", Component: IVR },
      { path: "security", Component: Security },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
