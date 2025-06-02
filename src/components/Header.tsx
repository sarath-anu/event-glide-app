
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchIcon, User, Calendar, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <Calendar className="h-6 w-6 text-primary mr-2" />
            <span className="font-heading font-semibold text-xl">EventEase</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            to="/" 
            className={`header-nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link 
            to="/events" 
            className={`header-nav-link ${isActive("/events") ? "active" : ""}`}
          >
            Events
          </Link>
          {user && (
            <>
              <Link 
                to="/dashboard" 
                className={`header-nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin" 
                className={`header-nav-link ${isActive("/admin") ? "active" : ""} flex items-center gap-1`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </>
          )}
          <Link 
            to="/about" 
            className={`header-nav-link ${isActive("/about") ? "active" : ""}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`header-nav-link ${isActive("/contact") ? "active" : ""}`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" className="ml-2" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pb-3 pt-2 shadow-lg">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/events"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
            onClick={() => setIsMenuOpen(false)}
          >
            Events
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-1 px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </>
          )}
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="mt-4 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {user.email}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-center" 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="justify-center" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button size="sm" className="justify-center" asChild>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
