"use client";

import { useState, useMemo } from "react";
import { Edit, MoreVertical, Search, Trash2, Filter, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceDurationOptions } from "@/lib/helpers";

interface ServiceFilters {
  minPrice: string;
  maxPrice: string;
  minDuration: string;
  maxDuration: string;
  availableOn: string;
}

interface ServiceSorting {
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

interface ServicesTableProps {
  services: ServiceWithStaff[];
  categories: CategoryData[];
  pagination?: PaginationData;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  filters: ServiceFilters;
  onFiltersChange: {
    setMinPrice: (value: string) => void;
    setMaxPrice: (value: string) => void;
    setMinDuration: (value: string) => void;
    setMaxDuration: (value: string) => void;
    setAvailableOn: (value: string) => void;
  };
  sorting: ServiceSorting;
  onSortingChange: {
    setSortBy: (value: string) => void;
    setSortOrder: (value: "ASC" | "DESC") => void;
  };
  onEdit: (service: ServiceWithStaff) => void;
  onView: (service: ServiceWithStaff) => void;
  onDelete: (serviceId: number) => void;
  onBulkDelete: (serviceIds: number[]) => void;
  isDeleting: boolean;
  isBulkDeleting: boolean;
}

export function ServicesTable({
  services,
  categories,
  pagination,
  searchQuery,
  onSearchChange,
  onPageChange,
  filters,
  onFiltersChange,
  sorting,
  onSortingChange,
  onEdit,
  onView,
  onDelete,
  onBulkDelete,
  isDeleting,
  isBulkDeleting,
}: ServicesTableProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  // Local filter state (temporary until Apply is clicked)
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);
  const [localMinDuration, setLocalMinDuration] = useState(filters.minDuration);
  const [localMaxDuration, setLocalMaxDuration] = useState(filters.maxDuration);
  const [localAvailableOn, setLocalAvailableOn] = useState(filters.availableOn);
  const [localSortBy, setLocalSortBy] = useState(sorting.sortBy);
  const [localSortOrder, setLocalSortOrder] = useState(sorting.sortOrder);

  // Filter by category tab (search is handled server-side now)
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        activeTab === "all" || service.CategoryId === Number(activeTab);
      return matchesCategory;
    });
  }, [services, activeTab]);

  const getDurationLabel = (duration: number) => {
    const option = serviceDurationOptions.find((opt) => opt.value === duration.toString());
    return option?.label || `${duration} min`;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const handleDeleteClick = (serviceId: number) => {
    setServiceToDelete(serviceId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      onDelete(serviceToDelete);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  // Selection handlers
  const allFilteredServiceIds = filteredServices.map((s) => s.id);
  const isAllSelected =
    allFilteredServiceIds.length > 0 &&
    allFilteredServiceIds.every((id) => selectedServices.includes(id));
  const isSomeSelected =
    selectedServices.length > 0 &&
    !isAllSelected &&
    allFilteredServiceIds.some((id) => selectedServices.includes(id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedServices([]);
    } else {
      setSelectedServices(allFilteredServiceIds);
    }
  };

  const handleSelectService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    await onBulkDelete(selectedServices);
    setSelectedServices([]);
    setBulkDeleteDialogOpen(false);
  };

  const renderPaginationItems = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const items = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;

    // Always show first page
    items.push(
      <PaginationItem key="1">
        <PaginationLink
          onClick={() => onPageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(<PaginationEllipsis key="ellipsis-end" />);
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const hasActiveFilters = () => {
    return (
      filters.minPrice ||
      filters.maxPrice ||
      filters.minDuration ||
      filters.maxDuration ||
      filters.availableOn
    );
  };

  const hasUnappliedChanges = () => {
    return (
      localMinPrice !== filters.minPrice ||
      localMaxPrice !== filters.maxPrice ||
      localMinDuration !== filters.minDuration ||
      localMaxDuration !== filters.maxDuration ||
      localAvailableOn !== filters.availableOn ||
      localSortBy !== sorting.sortBy ||
      localSortOrder !== sorting.sortOrder
    );
  };

  const applyFilters = () => {
    onFiltersChange.setMinPrice(localMinPrice);
    onFiltersChange.setMaxPrice(localMaxPrice);
    onFiltersChange.setMinDuration(localMinDuration);
    onFiltersChange.setMaxDuration(localMaxDuration);
    onFiltersChange.setAvailableOn(localAvailableOn);
    onSortingChange.setSortBy(localSortBy);
    onSortingChange.setSortOrder(localSortOrder);
  };

  const clearAllFilters = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setLocalMinDuration("");
    setLocalMaxDuration("");
    setLocalAvailableOn("");
    onFiltersChange.setMinPrice("");
    onFiltersChange.setMaxPrice("");
    onFiltersChange.setMinDuration("");
    onFiltersChange.setMaxDuration("");
    onFiltersChange.setAvailableOn("");
  };

  const days = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  return (
    <>
      <div className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={hasActiveFilters() ? "border-primary" : ""}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters() && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  •
                </Badge>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Filters</h3>
                {hasActiveFilters() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-2 text-xs"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear all
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range (£)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={localMinPrice}
                      onChange={(e) => setLocalMinPrice(e.target.value)}
                      className="h-9"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={localMaxPrice}
                      onChange={(e) => setLocalMaxPrice(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Duration Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (min)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={localMinDuration}
                      onChange={(e) => setLocalMinDuration(e.target.value)}
                      className="h-9"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={localMaxDuration}
                      onChange={(e) => setLocalMaxDuration(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Available On */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available On</label>
                  <Select
                    value={localAvailableOn}
                    onValueChange={setLocalAvailableOn}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All days</SelectItem>
                      {days.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="pt-2 border-t">
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <div className="flex gap-2">
                  <Select
                    value={localSortBy}
                    onValueChange={setLocalSortBy}
                  >
                    <SelectTrigger className="h-9 flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="fullPrice">Price</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setLocalSortOrder(
                        localSortOrder === "ASC" ? "DESC" : "ASC"
                      )
                    }
                    className="h-9 px-3"
                  >
                    {localSortOrder === "ASC" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={applyFilters}
                  disabled={!hasUnappliedChanges()}
                  size="sm"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All Services ({services.length})
            </TabsTrigger>
            {categories.map((category) => {
              return (
                <TabsTrigger key={category.id} value={category.id.toString()}>
                  {category.name} ({category.serviceCount ?? 0})
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Bulk Action Toolbar */}
            {selectedServices.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                <p className="text-sm font-medium">
                  {selectedServices.length} service(s) selected
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDeleteClick}
                  disabled={isBulkDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            )}

            {filteredServices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">
                  {searchQuery || hasActiveFilters()
                    ? "No services match your filters."
                    : "No services in this category yet."}
                </p>
                {(searchQuery || hasActiveFilters()) && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      onSearchChange("");
                      clearAllFilters();
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all services"
                          className={isSomeSelected ? "opacity-50" : ""}
                        />
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Name
                          {sorting.sortBy === "name" && (
                            sorting.sortOrder === "ASC" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Category
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Duration
                          {sorting.sortBy === "duration" && (
                            sorting.sortOrder === "ASC" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Price
                          {sorting.sortBy === "fullPrice" && (
                            sorting.sortOrder === "ASC" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow 
                        key={service.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={(e) => {
                          // Don't trigger row click if clicking on checkbox or dropdown
                          const target = e.target as HTMLElement;
                          if (
                            target.closest('button') || 
                            target.closest('[role="checkbox"]') ||
                            target.closest('[data-radix-collection-item]')
                          ) {
                            return;
                          }
                          onView(service);
                        }}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() => handleSelectService(service.id)}
                            aria-label={`Select ${service.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div>{service.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">
                              {service.description}
                            </div>
                            <div className="sm:hidden mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {getCategoryName(service.CategoryId)}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {service.description}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary">
                            {getCategoryName(service.CategoryId)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getDurationLabel(service.duration)}</TableCell>
                        <TableCell>£{service.fullPrice.toFixed(2)}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEdit(service)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(service.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredServices.length} of {pagination.total} services
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                    className={
                      pagination.page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      onPageChange(
                        Math.min(pagination.totalPages, pagination.page + 1)
                      )
                    }
                    className={
                      pagination.page === pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Services</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedServices.length} service(s)? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteConfirm}
              disabled={isBulkDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBulkDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
