
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { getEvents, getEventsByCategory, searchEvents, Event } from "@/lib/supabase-data";
import EventCardSupabase from "@/components/EventCardSupabase";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Filter, SortAsc, SortDesc } from "lucide-react";

const categoryOptions = [
  { id: "sports" as const, name: "Sports" },
  { id: "college" as const, name: "College" },
  { id: "entertainment" as const, name: "Entertainment" },
  { id: "circus" as const, name: "Circus" },
  { id: "theater" as const, name: "Theater" },
  { id: "music" as const, name: "Music" },
  { id: "other" as const, name: "Other" }
];

type SortOption = "date" | "name" | "popularity";
type SortDirection = "asc" | "desc";

const EventListingSupabase = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events', selectedCategory, searchQuery],
    queryFn: async () => {
      if (searchQuery.trim()) {
        return await searchEvents(searchQuery);
      } else if (selectedCategory) {
        return await getEventsByCategory(selectedCategory);
      } else {
        return await getEvents();
      }
    },
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };
  
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };
  
  // Sort events based on selected option and direction
  const sortedEvents = [...events].sort((a, b) => {
    let comparison = 0;
    
    if (sortOption === "date") {
      comparison = new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    } else if (sortOption === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortOption === "popularity") {
      comparison = (a.likes || 0) - (b.likes || 0);
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-3/4 rounded-md bg-gray-200"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-lg bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading events</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-heading font-bold">All Events</h1>
          <div className="md:w-96">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <CategoryFilter 
            categories={categoryOptions} 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
          
          <div className="flex items-center gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Filter className="h-4 w-4 mr-1" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="text-sm px-2 py-1 rounded-md border"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="popularity">Popularity</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSortDirection}
            >
              {sortDirection === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {sortedEvents.length} {sortedEvents.length === 1 ? "event" : "events"} found
        </p>
        
        {/* Event listings */}
        {sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map((event) => (
              <EventCardSupabase key={event.id} event={event} />
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
      
      {/* Footer */}
      <footer className="bg-muted py-8 mt-12">
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

export default EventListingSupabase;
