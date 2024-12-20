import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";

import App from "@/App.tsx";
import queryClient from "@/config/queryClient.ts";
import "@/lib/i18n";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </BrowserRouter>
  </QueryClientProvider>
);
