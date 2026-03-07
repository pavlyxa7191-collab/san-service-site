import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
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
    </div>
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
