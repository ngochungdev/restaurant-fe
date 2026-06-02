import { QueryClient } from "@tanstack/react-query";

export const QUERY_STALE_TIME = 1000 * 60 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
    },
  },
});

export const queryKeys = {
  categories: ["categories"],
  leads: ["leads"],
  menus: ["menus"],
  reservations: ["reservations"],
  settings: ["settings"],
};
