"use client";

import { useState, useMemo } from "react";
import { Edit, MoreVertical, Search, Trash2 } from "lucide-react";
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
import { serviceDurationOptions } from "@/lib/helpers";

interface ServicesTableProps {
  services: ServiceWithStaff[];
  categories: CategoryData[];
  pagination?: PaginationData;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: number) => void;
  isDeleting: boolean;
}

export function ServicesTable({
  services,
  categories,
  pagination,
  searchQuery,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
  isDeleting,
}: ServicesTableProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

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

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
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
            {filteredServices.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery
                  ? "No services match your search."
                  : "No services in this category yet."}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Category
                      </TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
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
                        <TableCell>
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
    </>
  );
}
