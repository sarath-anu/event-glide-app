
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar = ({ onSearch, className = "", placeholder = "Search events, locations, or categories..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
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
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 w-full"
        />
      </div>
      <Button type="submit" disabled={!query.trim()}>
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
