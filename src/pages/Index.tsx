
import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import EventCarousel from "@/components/EventCarousel";
import CategoryFilter from "@/components/CategoryFilter";
import { 
  EventCategory, 
  events, 
  getFeaturedEvents,
  getTrendingEvents,
  getEventsByCategory,
  searchEvents 
} from "@/lib/data";
import EventCard from "@/components/EventCard";

const categoryOptions = [
  { id: "sports" as EventCategory, name: "Sports" },
  { id: "college" as EventCategory, name: "College" },
  { id: "entertainment" as EventCategory, name: "Entertainment" },
  { id: "circus" as EventCategory, name: "Circus" },
  { id: "theater" as EventCategory, name: "Theater" },
  { id: "music" as EventCategory, name: "Music" },
  { id: "other" as EventCategory, name: "Other" }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const featuredEvents = getFeaturedEvents();
  const trendingEvents = getTrendingEvents();
  
  const filteredEvents = searchQuery.trim() !== "" 
    ? searchEvents(searchQuery)
    : selectedCategory 
      ? getEventsByCategory(selectedCategory)
      : events;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: EventCategory | null) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background pt-10 pb-8 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Find and Book Amazing Events
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover sports events, college fests, entertainment shows, and more — all in one place.
          </p>
          <SearchBar onSearch={handleSearch} className="max-w-2xl mx-auto" />
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container py-8 px-4">
        {/* Featured Events */}
        <section className="mb-12">
          <EventCarousel title="Featured Events" events={featuredEvents} />
        </section>
        
        {/* Trending Events */}
        <section className="mb-12">
          <EventCarousel title="Trending Events" events={trendingEvents} />
        </section>
        
        {/* Browse Events */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-heading font-semibold">Browse Events</h2>
            <div className="md:max-w-md w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          
          <CategoryFilter 
            categories={categoryOptions} 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
          
          {/* Results */}
          <div className="mt-8">
            {searchQuery && (
              <p className="text-muted-foreground mb-4">
                {filteredEvents.length} {filteredEvents.length === 1 ? "result" : "results"} found for "{searchQuery}"
              </p>
            )}
            
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  Try changing your search query or filters
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-lg font-semibold font-heading">EventEase</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                The easiest way to discover and book events.
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <h4 className="font-medium mb-2">Company</h4>
                <ul className="space-y-1 text-sm">
                  <li><a href="#" className="hover:underline">About</a></li>
                  <li><a href="#" className="hover:underline">Contact</a></li>
                  <li><a href="#" className="hover:underline">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Support</h4>
                <ul className="space-y-1 text-sm">
                  <li><a href="#" className="hover:underline">Help Center</a></li>
                  <li><a href="#" className="hover:underline">Privacy</a></li>
                  <li><a href="#" className="hover:underline">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} EventEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
