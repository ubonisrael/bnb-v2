"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, Calendar, Users, DollarSign, PoundSterling } from "lucide-react";
import dayjs from "@/utils/dayjsConfig";

// Define the Program interface
interface Program {
  id: string;
  name: string;
  banner_image_url?: string;
  start_date: string;
  end_date: string;
  price: number;
  capacity: number;
  is_published: boolean;
  createdAt: string;
}

// Dummy data for programs
const dummyPrograms: Program[] = [
  {
    id: "1",
    name: "Beginner's Yoga Workshop",
    banner_image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop",
    start_date: "2025-11-01T09:00:00Z",
    end_date: "2025-11-01T11:00:00Z",
    price: 45.00,
    capacity: 20,
    is_published: true,
    createdAt: "2025-10-15T08:00:00Z",
  },
  {
    id: "2",
    name: "Advanced Meditation Retreat",
    banner_image_url: "",
    start_date: "2025-11-15T10:00:00Z",
    end_date: "2025-11-17T16:00:00Z",
    price: 250.00,
    capacity: 15,
    is_published: false,
    createdAt: "2025-10-12T14:30:00Z",
  },
  {
    id: "3",
    name: "Wellness & Nutrition Seminar",
    banner_image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop",
    start_date: "2025-12-05T14:00:00Z",
    end_date: "2025-12-05T17:00:00Z",
    price: 75.00,
    capacity: 30,
    is_published: true,
    createdAt: "2025-10-10T11:15:00Z",
  },
  {
    id: "4",
    name: "Monthly Fitness Challenge",
    banner_image_url: "",
    start_date: "2025-11-01T06:00:00Z",
    end_date: "2025-11-30T20:00:00Z",
    price: 120.00,
    capacity: 50,
    is_published: true,
    createdAt: "2025-10-08T16:45:00Z",
  },
];

// Generate random colors for programs without banner images
const getRandomColor = (id: string) => {
  const colors = [
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-green-500 to-teal-500",
    "bg-gradient-to-r from-orange-500 to-red-500",
    "bg-gradient-to-r from-indigo-500 to-purple-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
  ];
  const index = parseInt(id) % colors.length;
  return colors[index];
};

export default function ProgramsPage() {
  const [programs] = useState<Program[]>(dummyPrograms);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<string>("");

  // Get user's timezone
  const userTimezone = dayjs.tz.guess();

  // Filter and search programs
  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!filterBy) return matchesSearch;
    
    // Apply filters based on filterBy value
    switch (filterBy) {
      case "published":
        return matchesSearch && program.is_published;
      case "unpublished":
        return matchesSearch && !program.is_published;
      case "price_high":
        return matchesSearch && program.price > 100;
      case "price_low":
        return matchesSearch && program.price <= 100;
      default:
        return matchesSearch;
    }
  });

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = dayjs(startDate).tz(userTimezone);
    const end = dayjs(endDate).tz(userTimezone);
    
    if (start.isSame(end, 'day')) {
      return `${start.format('MMM D, YYYY')} • ${start.format('h:mm A')} - ${end.format('h:mm A')}`;
    } else {
      return `${start.format('MMM D, YYYY h:mm A')} - ${end.format('MMM D, YYYY h:mm A')}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#121212]">Programs</h1>
          <p className="text-[#6E6E73]">Manage your programs and workshops.</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterBy("")}>
                All Programs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("published")}>
                Published Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("unpublished")}>
                Unpublished Only
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterBy("price_high")}>
                Price &gt; £100
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("price_low")}>
                Price &lt;= £100
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Create New Program Button */}
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Program
          </Button>
        </div>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {programs.length === 0 ? "No programs yet" : "No programs found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {programs.length === 0 
                ? "Create your first program to get started." 
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {programs.length === 0 && (
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Program
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Programs Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="border-0 shadow-card overflow-hidden hover:shadow-lg transition-shadow">
              {/* Banner Image or Random Color */}
              <div className="relative h-48 w-full">
                {program.banner_image_url ? (
                  <img
                    src={program.banner_image_url}
                    alt={program.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className={`h-full w-full ${getRandomColor(program.id)} flex items-center justify-center`}>
                    <span className="text-white text-xl font-semibold">
                      {program.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Published Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant={program.is_published ? "default" : "secondary"}>
                    {program.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-[#121212] line-clamp-2">
                  {program.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Date Range */}
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-[#6E6E73] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#6E6E73]">
                    {formatDateRange(program.start_date, program.end_date)}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <PoundSterling className="h-4 w-4 text-[#6E6E73]" />
                  <span className="text-lg font-semibold text-[#121212]">
                    {program.price.toFixed(2)}
                  </span>
                </div>

                {/* Capacity */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#6E6E73]" />
                  <span className="text-sm text-[#6E6E73]">
                    Up to {program.capacity} participants
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
