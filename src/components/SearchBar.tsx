
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`flex w-full items-center space-x-2 ${className}`}
    >
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search events, locations, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <Button type="submit">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
