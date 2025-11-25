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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { serviceDurationOptions } from "@/lib/helpers";

interface ServicesTableProps {
  services: Service[];
  categories: ServiceCategory[];
  onEdit: (service: Service) => void;
  onDelete: (serviceId: number) => void;
  isDeleting: boolean;
}

export function ServicesTable({
  services,
  categories,
  onEdit,
  onDelete,
  isDeleting,
}: ServicesTableProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeTab === "all" || service.CategoryId === Number(activeTab);
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, activeTab]);

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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All Services ({services.length})
            </TabsTrigger>
            {categories.map((category) => {
              const count = services.filter(
                (s) => s.CategoryId === category.id
              ).length;
              return (
                <TabsTrigger key={category.id} value={category.id.toString()}>
                  {category.name} ({count})
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
