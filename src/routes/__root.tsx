import "../styles/globals.css";

import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
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
