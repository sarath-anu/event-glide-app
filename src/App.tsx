
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import EventListing from "./pages/EventListing";
import EventDetail from "./pages/EventDetail";
import EventRegistration from "./pages/EventRegistration";
import EventBooking from "./pages/EventBooking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import CommunityChat from "./pages/CommunityChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<EventListing />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/event/:id/register" element={
              <ProtectedRoute>
                <EventRegistration />
              </ProtectedRoute>
            } />
            <Route path="/event/:id/book" element={
              <ProtectedRoute>
                <EventBooking />
              </ProtectedRoute>
            } />
            <Route path="/book" element={<Navigate to="/events" />} />
            <Route path="/chat" element={
              <ProtectedRoute>
                <CommunityChat />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
