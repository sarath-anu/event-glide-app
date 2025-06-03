
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import IndexSupabase from "./pages/IndexSupabase";
import EventListing from "./pages/EventListing";
import EventListingSupabase from "./pages/EventListingSupabase";
import EventDetail from "./pages/EventDetail";
import EventDetailSupabase from "./pages/EventDetailSupabase";
import EventRegistration from "./pages/EventRegistration";
import EventRegistrationSupabase from "./pages/EventRegistrationSupabase";
import EventBooking from "./pages/EventBooking";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import EventDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import CommunityChat from "./pages/CommunityChat";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IndexSupabase />} />
              <Route path="/events" element={<EventListingSupabase />} />
              <Route path="/events/:id" element={<EventDetailSupabase />} />
              <Route path="/events/:id/register" element={<EventRegistrationSupabase />} />
              <Route path="/events/:id/booking" element={<EventBooking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<EventDashboard />} />
              <Route path="/admin" element={<EventDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/community-chat" element={<CommunityChat />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
