import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BusinessInfoProps {
  name: string;
  location: string | null;
}

export default function BusinessInfo({ name, location }: BusinessInfoProps) {
  return (
    <Card className="bg-white sm:rounded-2xl shadow-lg">
      <CardContent className="p-4 md:p-8">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
          {name}
        </h1>
        {location && (
          <div className="flex items-center text-slate-600 text-sm sm:text-lg">
            <MapPin className="mr-3 text-primary h-5 w-5" />
            <span>{location}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
