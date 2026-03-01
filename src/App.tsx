import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import SOS from "./pages/SOS";
import Safety from "./pages/Safety";
import Hotels from "./pages/Hotels";
import Transport from "./pages/Transport";
import Documents from "./pages/Documents";
import Chat from "./pages/Chat";
import Currency from "./pages/Currency";
import TripPlanner from "./pages/TripPlanner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
