import "../styles/globals.css";

import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NotFound } from "~/components/not-found";

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <Scripts />

      <TanStackRouterDevtools />
    </>
  ),
});
