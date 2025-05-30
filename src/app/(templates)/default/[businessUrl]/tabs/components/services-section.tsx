import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ServiceCategory } from "../../types";
import ServiceCard from "./service-card";

interface ServicesSectionProps {
  serviceCategories: ServiceCategory[];
  index: number;
  gotoTab?: (index: number) => void;
}

export default function ServicesSection({ serviceCategories, index, gotoTab }: ServicesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Set<number>>(new Set());

  const toggleAccordion = (index: number) => {
    const newOpenAccordions = new Set(openAccordions);
    if (newOpenAccordions.has(index)) {
      newOpenAccordions.delete(index);
    } else {
      newOpenAccordions.add(index);
    }
    setOpenAccordions(newOpenAccordions);
  };

  const filteredCategories = serviceCategories.map(category => {
    if (searchTerm === "") {
      return category;
    }
    
    const categoryMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const filteredServices = category.services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (categoryMatch || filteredServices.length > 0) {
      return {
        ...category,
        services: categoryMatch ? category.services : filteredServices
      };
    }
    
    return null;
  }).filter(Boolean) as ServiceCategory[];

  return (
    <Card className="bg-white rounded-2xl shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Services</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search services..."
              className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full lg:w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCategories.map((category, i) => (
            <Collapsible
              key={index}
              open={openAccordions.has(i)}
              onOpenChange={() => toggleAccordion(i)}
            >
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <CollapsibleTrigger className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <ChevronRight 
                      className={`mr-3 text-slate-400 transition-transform duration-200 h-4 w-4 ${
                        openAccordions.has(i) ? 'rotate-90' : ''
                      }`}
                    />
                    <span className="font-semibold text-slate-800">{category.name}</span>
                  </div>
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {category.services.length}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-4">
                  <div className="grid gap-4">
                    {category.services.map((service) => (
                      <ServiceCard key={service.id} service={service} index={index} gotoBooking={gotoTab}/>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
