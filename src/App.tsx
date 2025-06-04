
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import IndexSupabase from "./pages/IndexSupabase";
import EventDetailSupabase from "./pages/EventDetailSupabase";
import EventListingSupabase from "./pages/EventListingSupabase";
import EventRegistrationSupabase from "./pages/EventRegistrationSupabase";
import EventBooking from "./pages/EventBooking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CommunityChat from "./pages/CommunityChat";
import NotFound from "./pages/NotFound";

// Components
import EventRedirect from "./components/EventRedirect";
import EventSubmissionForm from "./components/EventSubmissionForm";

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
              <Route path="/event/:id" element={<EventRedirect />} />
              <Route path="/submit-event" element={<EventSubmissionForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/community" element={<CommunityChat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
