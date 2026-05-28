import { Toaster } from "sonner";
// @ts-ignore: module has no declaration file (LanguageContext.jsx)
import { LanguageProvider } from "./contexts/LanguageContext";
// @ts-ignore: module has no declaration file (JSX router/index.jsx)
import Router from "./router/index";

export default function App() {
  return (
    <LanguageProvider>
      <Router />
      <Toaster position="top-right" richColors />
    </LanguageProvider>
  );
}
