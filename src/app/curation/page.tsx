"use client";

import * as React from "react";
import { Search } from "lucide-react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";

import TourCard from "./components/TourCard";
import { TOURS_DATA } from "./constants/tours";

import type { Tour } from "./types/tour";

export default function CurationPage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const categories: string[] = ["All", "Adventure", "Relaxation", "Cultural"];

  const filteredTours: Tour[] = TOURS_DATA.filter((tour: Tour): boolean => {
    const matchesSearch: boolean =
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory: boolean =
      selectedCategory === "All" || tour.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="flex flex-col gap-6 animate-slide-up">
      {/* Header Title */}
      <Heading level={1} variant="display-lg" subheading="Explore and edit the premium, handpicked destination catalog.">
        Curation Portfolio
      </Heading>

      {/* Filter Area */}
      <div className="p-6 rounded-2xl bg-app-surface border border-app-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-app-muted absolute left-3.5 top-5.5 z-10 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Filter tours by title, country..."
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {categories.map((category: string): React.JSX.Element => (
            <button
              key={category}
              onClick={(): void => { setSelectedCategory(category); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border cursor-pointer hover:scale-102 active:scale-98 duration-200 ${
                selectedCategory === category
                  ? "bg-app-brand border-app-brand text-white shadow-lg shadow-app-brand/20"
                  : "bg-app-surface border-app-border text-app-muted hover:text-app-fg hover:border-app-brand"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Catalog */}
      {filteredTours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour: Tour): React.JSX.Element => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-app-surface border border-app-border rounded-2xl shadow-sm animate-fade-in">
          <Search className="w-12 h-12 text-app-muted" />
          <h3 className="text-base font-bold text-app-fg">No tours match your filter</h3>
          <p className="text-app-muted text-xs max-w-sm">
            Try adjusting your search terms or clearing categories to see other items.
          </p>
          <Button
            onClick={(): void => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            variant="secondary"
            className="mt-2"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </section>
  );
}
