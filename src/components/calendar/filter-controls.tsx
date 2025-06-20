"use client";

import { Filter, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { ServiceCategory } from "../onboarding/type";

export function FilterControls({
  filters,
  setFilters,
  settings,
}: Omit<CalendarControlsProps, "date" | "setDate" | "view">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-[#E0E0E5] bg-white text-[#121212]"
        >
          <Filter className="h-4 w-4" />
          Filter
          {(filters.category.length > 0 || filters.service.length > 0) && (
            <Badge variant="secondary" className="ml-2">
              {filters.category.length + filters.service.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-base font-semibold">
          Filter by Category
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {settings?.categories.map((cat) => (
          <DropdownMenuItem
            key={cat.id}
            className="flex items-center gap-3 py-2"
            onSelect={(e) => {
              e.preventDefault();
              setFilters((prev: FilterProps) => ({
                ...prev,
                category: prev.category.find((s) => s.id === cat.id)
                  ? prev.category.filter((s) => s.id !== cat.id)
                  : [...prev.category, cat],
              }));
            }}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded border">
              {filters.category.find((s: ServiceCategory) => s.id === cat.id) && (
                <X className="h-4 w-4" />
              )}
            </div>
            <span className="font-medium">
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-base font-semibold">
          Filter by Service
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {settings?.services.map((service) => (
          <DropdownMenuItem
            key={service.id}
            className="flex items-center gap-3 py-2"
            onSelect={(e) => {
              e.preventDefault();
              setFilters((prev: FilterProps) => ({
                ...prev,
                service: prev.service.includes(service)
                  ? prev.service.filter((s) => s !== service)
                  : [...prev.service, service],
              }));
            }}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded border">
              {filters.service.includes(service) && <X className="h-4 w-4" />}
            </div>
            <span className="font-medium">{service.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive py-2"
          onSelect={() => setFilters({ category: [], service: [] })}
        >
          Clear all filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
