
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Shield, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
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

        <div className="flex items-center gap-2">
          {/* Admin Button - Only for logged in users */}
          {user && (
            <Button variant="outline" size="sm" asChild className="hidden md:flex">
              <Link to="/admin" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Dashboard Icon and User Avatar with Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials(user.email || '')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
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
