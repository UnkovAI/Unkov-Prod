import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ScrollRestorer, BackToTop } from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home               from "./pages/Home";
import Features           from "./pages/Features";
import HowItWorks         from "./pages/HowItWorks";
import Roadmap            from "./pages/Roadmap";
import Pricing            from "./pages/Pricing";
import Company            from "./pages/Company";
import ForInvestors       from "./pages/ForInvestors";
import Blog               from "./pages/Blog";
import Careers            from "./pages/Careers";
import Press              from "./pages/Press";
import Legal              from "./pages/Legal";
import Contact            from "./pages/Contact";
import Integrations       from "./pages/Integrations";
import EarlyAccess        from "./pages/EarlyAccess";
import FreeTrial          from "./pages/FreeTrial";
import InvestorGate       from "./pages/InvestorGate";
import PitchDeck          from "./pages/PitchDeck";
import SolutionBFSI       from "./pages/SolutionBFSI";
import SolutionHealthcare from "./pages/SolutionHealthcare";
import Docs            from "./pages/Docs";
import NotFound           from "./pages/NotFound";

// Auth pages
import Login              from "./pages/Login";
import SignUp             from "./pages/SignUp";
import AdminUpgrade       from "./pages/AdminUpgrade";

// Dashboards
import Dashboard          from "./pages/Dashboard";
import DemoDashboard      from "./pages/DemoDashboard";

// Force light mode on public site
if (typeof document !== "undefined") {
  document.documentElement.classList.remove("dark");
  document.body.classList.remove("dark");
  document.documentElement.style.colorScheme = "light";
}

function Router() {
  return (
    <Switch>
      {/* ── Public marketing pages ─────────────────────────── */}
      <Route path="/"                      component={Home} />
      <Route path="/features"              component={Features} />
      <Route path="/how-it-works"          component={HowItWorks} />
      <Route path="/roadmap"               component={Roadmap} />
      <Route path="/pricing"               component={Pricing} />
      <Route path="/company"               component={Company} />
      <Route path="/blog"                  component={Blog} />
      <Route path="/careers"               component={Careers} />
      <Route path="/press"                 component={Press} />
      <Route path="/legal"                 component={Legal} />
      <Route path="/contact"               component={Contact} />
      <Route path="/integrations"          component={Integrations} />
      <Route path="/docs"                  component={Docs} />
      <Route path="/docs/:connector"       component={Docs} />
      <Route path="/early-access"          component={EarlyAccess} />
      <Route path="/free-trial"            component={FreeTrial} />
      <Route path="/solutions/bfsi"        component={SolutionBFSI} />
      <Route path="/solutions/healthcare"  component={SolutionHealthcare} />
      <Route path="/investor-gate"         component={InvestorGate} />
      <Route path="/for-investors"         component={ForInvestors} />
      <Route path="/pitch-deck"            component={PitchDeck} />

      {/* ── Auth pages ─────────────────────────────────────── */}
      <Route path="/login"                 component={Login} />
      <Route path="/signup"                component={SignUp} />

      {/* ── Protected: Admin only ──────────────────────────── */}
      <Route path="/admin/upgrade">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminUpgrade />
          </ProtectedRoute>
        )}
      </Route>

      {/* ── Protected: Paying customers + admin ────────────── */}
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute requiredRole="paying_customer">
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>

      {/* ── Protected: Pilot customers + admin ─────────────── */}
      <Route path="/demo/dashboard">
        {() => (
          <ProtectedRoute requiredRole="pilot_customer">
            <DemoDashboard />
          </ProtectedRoute>
        )}
      </Route>
      {/* ── Legacy redirects ───────────────────────────────── */}
      <Route path="/demo">
        {() => <Redirect to="/login" />}
      </Route>
      <Route path="/demo-request">
        {() => <Redirect to="/login" />}
      </Route>
      <Route path="/risk-heatmap">
        {() => <Redirect to="/features" />}
      </Route>
      <Route path="/ai-explainability">
        {() => <Redirect to="/features" />}
      </Route>
      <Route path="/access-simulator">
        {() => <Redirect to="/early-access" />}
      </Route>
      <Route path="/msp-console">
        {() => <Redirect to="/features" />}
      </Route>
      <Route path="/threat-feed">
        {() => <Redirect to="/features" />}
      </Route>

      <Route path="/404"                   component={NotFound} />
      <Route                               component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <ScrollRestorer />
          <Router />
          <BackToTop />
        </TooltipProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
