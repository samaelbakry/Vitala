
import type { ReactNode } from "react";
import { Provider } from "react-redux";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import { store } from "./store";
import AuthInitializer from "../features/auth/components/AuthInitializer";

type ProvidersProps = {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 30, // 30 min
      retry: 1,
      refetchOnWindowFocus: false,
    },

    mutations: {
      retry: 0,
    },
  },
});

export default function Providers({ children}: ProvidersProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer />

        {children}

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
