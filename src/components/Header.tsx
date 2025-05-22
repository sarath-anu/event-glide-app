
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchIcon, User, Calendar } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
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
            to="/register" 
            className={`header-nav-link ${isActive("/register") ? "active" : ""}`}
          >
            Register
          </Link>
          <Link 
            to="/book" 
            className={`header-nav-link ${isActive("/book") ? "active" : ""}`}
          >
            Book
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

        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" className="ml-2" asChild>
              <Link to="/register">Sign up</Link>
            </Button>
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
          <Link
            to="/register"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Link>
          <Link
            to="/book"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
            onClick={() => setIsMenuOpen(false)}
          >
            Book
          </Link>
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
