import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import ServicePage from "./pages/ServicePage";
import Prices from "./pages/Prices";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Blog from "./pages/Blog";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import AdminLeads from "./pages/AdminLeads";
import StickyCallButton from "./components/StickyCallButton";
import ExitIntentPopup from "./components/ExitIntentPopup";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function PublicRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <SiteHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/prices" component={Prices} />
          <Route path="/about" component={About} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={Blog} />
          {/* Service pages */}
          <Route path="/services/:service" component={ServicePage} />
          {/* Programmatic SEO: service + city */}
          <Route path="/services/:service/:city" component={ServicePage} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <SiteFooter />
      <StickyCallButton />
      <ExitIntentPopup />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin panel — no site header/footer */}
      <Route path="/admin/leads" component={AdminLeads} />
      {/* All public pages */}
      <Route component={PublicRouter} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
