
import { useState } from "react";
import Header from "@/components/Header";
import { getApprovedEvents, EventCategory } from "@/lib/data";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Filter, SortAsc, SortDesc } from "lucide-react";

const categoryOptions = [
  { id: "sports" as EventCategory, name: "Sports" },
  { id: "college" as EventCategory, name: "College" },
  { id: "entertainment" as EventCategory, name: "Entertainment" },
  { id: "circus" as EventCategory, name: "Circus" },
  { id: "theater" as EventCategory, name: "Theater" },
  { id: "music" as EventCategory, name: "Music" },
  { id: "other" as EventCategory, name: "Other" }
];

type SortOption = "date" | "name" | "popularity";
type SortDirection = "asc" | "desc";

const EventListing = () => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Only get approved events
  const approvedEvents = getApprovedEvents();
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategorySelect = (category: EventCategory | null) => {
    setSelectedCategory(category);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };
  
  // Filter events based on search query and category
  const filteredEvents = approvedEvents.filter(event => {
    const matchesSearch = searchQuery === "" || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort events based on selected option and direction
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0;
    
    if (sortOption === "date") {
      comparison = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    } else if (sortOption === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortOption === "popularity") {
      comparison = a.likes - b.likes;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

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

export default EventListing;
