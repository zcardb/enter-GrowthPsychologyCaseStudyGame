import Home from "./pages/home";
import Play from "./pages/play";
import Principles from "./pages/principles";
import Progress from "./pages/progress";
import NotFound from "./pages/NotFound";

export const routers = [
  {
    path: "/",
    name: "home",
    element: <Home />,
  },
  {
    path: "/play/:levelId",
    name: "play",
    element: <Play />,
  },
  {
    path: "/principles",
    name: "principles",
    element: <Principles />,
  },
  {
    path: "/progress",
    name: "progress",
    element: <Progress />,
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
