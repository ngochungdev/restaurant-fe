import { Toaster } from "sonner";
// @ts-ignore: module has no declaration file (JSX router/index.jsx)
import Router from "./router/index";
// @ts-ignore: JSX provider file
import AppProviders from "./providers/AppProviders";

export default function App() {
  return (
    <AppProviders>
      <Router />
      <Toaster position="top-right" richColors />
    </AppProviders>
  );
}
