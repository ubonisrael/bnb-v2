import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Service } from "../../types";

interface ServiceCardProps {
  service: Service;
  index: number;
  gotoBooking?: (index: number) => void;
}

const ServiceCard = ({ service, index, gotoBooking }: ServiceCardProps) => {
  const { selectedServices, addService, removeService } = useApp();
  const isSelected = selectedServices.some((s) => s.id === service.id);
  const handleServiceToggle = () => {
    if (isSelected) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };
  const handleClick = () => {
    if (index === 0 && gotoBooking) {
      // If it's the landing page, navigate to booking
      gotoBooking(index + 1);
      return;
    }
    // Else, toggle selection
    handleServiceToggle();
  };
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              {service.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 mb-3">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>
              {service.availableDays.length === 7
                ? "Every day"
                : service.availableDays
                    .map((day) => day.substring(0, 3))
                    .join(", ")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-slate-600 dark:text-gray-300">
            <Clock className="h-4 w-4 mr-1" />
            <span>{service.duration} min</span>
          </div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            £{service.price}
          </div>
        </div>
        <Button
          onClick={handleClick}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {index === 0
            ? "Book"
            : !isSelected
            ? "Add to Cart"
            : "Remove from Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
