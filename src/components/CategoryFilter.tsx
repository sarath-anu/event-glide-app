
import { Badge } from "@/components/ui/badge";
import { EventCategory } from "@/lib/data";
import { MouseEvent } from "react";

interface CategoryFilterProps {
  categories: {
    id: EventCategory;
    name: string;
    icon?: string;
  }[];
  selectedCategory: EventCategory | null;
  onSelectCategory: (category: EventCategory | null) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  const handleCategoryClick = (e: MouseEvent<HTMLButtonElement>, category: EventCategory | null) => {
    e.preventDefault();
    onSelectCategory(category);
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      <button
        onClick={(e) => handleCategoryClick(e, null)}
        className={`px-3 py-1 rounded-full transition-all text-sm ${
          selectedCategory === null
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={(e) => handleCategoryClick(e, category.id)}
          className={`px-3 py-1 rounded-full transition-all text-sm ${
            selectedCategory === category.id
              ? `category-badge-${category.id}`
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
