
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents, searchEvents, getEventsByCategory } from "@/lib/supabase-data";
import Header from "@/components/Header";
import EventCardSupabase from "@/components/EventCardSupabase";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

const EventListingSupabase = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "");
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>(searchQuery || "");
  const [page, setPage] = useState(1);
  const eventsPerPage = 12;

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events', selectedCategory, currentSearchQuery],
    queryFn: () => {
      if (currentSearchQuery) {
        return searchEvents(currentSearchQuery);
      } else if (selectedCategory) {
        return getEventsByCategory(selectedCategory);
      } else {
        return getEvents();
      }
    },
  });

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchQuery) {
      setCurrentSearchQuery(searchQuery);
    }
  }, [categoryParam, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentSearchQuery("");
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setCurrentSearchQuery(query);
    setSelectedCategory("");
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setCurrentSearchQuery("");
    setPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (page - 1) * eventsPerPage;
  const paginatedEvents = events.slice(startIndex, startIndex + eventsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Events</h1>
          <p className="text-muted-foreground">
            There was an error loading the events. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Discover Events</h1>
          <p className="text-muted-foreground mb-6">
            Find and join amazing events happening around you
          </p>
          
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search events by name, description, or location..."
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Active Filters */}
          {(selectedCategory || currentSearchQuery) && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategory && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                  Category: {selectedCategory}
                </span>
              )}
              {currentSearchQuery && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                  Search: "{currentSearchQuery}"
                </span>
              )}
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {paginatedEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedEvents.map((event) => (
                <EventCardSupabase key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {currentSearchQuery || selectedCategory 
                ? "Try adjusting your search criteria or browse all events."
                : "There are no events available at the moment."
              }
            </p>
            {(currentSearchQuery || selectedCategory) && (
              <Button onClick={clearFilters}>
                View All Events
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListingSupabase;
