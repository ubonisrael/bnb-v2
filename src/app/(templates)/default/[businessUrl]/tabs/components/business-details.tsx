import { useState } from "react";
import {
  ChevronRight,
  Phone,
  Mail,
  Bath,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Instagram,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BusinessData } from "../../types";
import Map from "@/components/templates/default/Map";

interface BusinessDetailsProps {
  businessData: BusinessData;
}

export default function BusinessDetails({
  businessData,
}: BusinessDetailsProps) {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const [showFullAbout, setShowFullAbout] = useState(false);

  const toggleAccordion = (section: string) => {
    const newOpenAccordions = new Set(openAccordions);
    if (newOpenAccordions.has(section)) {
      newOpenAccordions.delete(section);
    } else {
      newOpenAccordions.add(section);
    }
    setOpenAccordions(newOpenAccordions);
  };

  const truncatedAbout = businessData.aboutUs.substring(0, 250) + "...";
  const shouldTruncate = businessData.aboutUs.length > 250;

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "Instagram":
        return <Instagram className="text-2xl" />;
      case "Facebook":
        return <Facebook className="text-2xl" />;
      case "Youtube":
        return <Youtube className="text-2xl" />;
      case "Linkedin":
        return <Linkedin className="text-2xl" />;
      case "Twitter":
        return <Twitter className="text-2xl" />;
      default:
        return <Twitter className="text-2xl" />;
    }
  };

  return (
    <>
      {/* Business Header */}
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
            <Bath className="text-white text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">
            {businessData.name}
          </h2>
          <p className="text-slate-600">{businessData.address}</p>
        </CardContent>
      </Card>

      {/* Map Section */}
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Location
          </h3>
          {businessData.latitude && businessData.longitude ? (
            <Map
              name={businessData.name}
              address={businessData.address}
              city={businessData.city}
              state={businessData.state}
              zip={businessData.zip}
              latitude={businessData.latitude}
              longitude={businessData.longitude}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-slate-100 rounded-lg">
              <p className="text-slate-500">Map location not available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Details Accordion */}
      <div className="space-y-4">
        {/* About Us */}
        <Collapsible
          open={openAccordions.has("about")}
          onOpenChange={() => toggleAccordion("about")}
        >
          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center">
                <ChevronRight
                  className={`mr-3 text-slate-400 transition-transform duration-200 h-4 w-4 ${
                    openAccordions.has("about") ? "rotate-90" : ""
                  }`}
                />
                <span className="font-semibold text-slate-800 text-lg">
                  About Us
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6">
              <div className="text-slate-600 leading-relaxed">
                <p>
                  {shouldTruncate && !showFullAbout
                    ? truncatedAbout
                    : businessData.aboutUs}
                </p>
                {shouldTruncate && (
                  <Button
                    variant="link"
                    className="text-primary hover:text-blue-700 font-medium mt-3 transition-colors duration-200 p-0 h-auto"
                    onClick={() => setShowFullAbout(!showFullAbout)}
                  >
                    {showFullAbout ? "Show less" : "Show more..."}
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Payment and Cancellation Policy */}
        <Collapsible
          open={openAccordions.has("policy")}
          onOpenChange={() => toggleAccordion("policy")}
        >
          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center">
                <ChevronRight
                  className={`mr-3 text-slate-400 transition-transform duration-200 h-4 w-4 ${
                    openAccordions.has("policy") ? "rotate-90" : ""
                  }`}
                />
                <span className="font-semibold text-slate-800 text-lg">
                  Payment & Cancellation Policy
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6">
              <div className="space-y-6 text-slate-600 text-sm">
                <ul className="space-y-1">
                  {businessData.bookingPolicy.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
                <p className="text-sm">{businessData.additionalPolicies}</p>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Contact */}
        <Collapsible
          open={openAccordions.has("contact")}
          onOpenChange={() => toggleAccordion("contact")}
        >
          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center">
                <ChevronRight
                  className={`mr-3 text-slate-400 transition-transform duration-200 h-4 w-4 ${
                    openAccordions.has("contact") ? "rotate-90" : ""
                  }`}
                />
                <span className="font-semibold text-slate-800 text-lg">
                  Contact
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6">
              <div className="space-y-4">
                <a
                  href={`tel:${businessData.phone}`}
                  className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                    <Phone className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Phone</p>
                    <p className="text-slate-600">{businessData.phone}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${businessData.email}`}
                  className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                    <Mail className="text-accent h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Email</p>
                    <p className="text-slate-600">{businessData.email}</p>
                  </div>
                </a>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Business Hours */}
        <Collapsible
          open={openAccordions.has("hours")}
          onOpenChange={() => toggleAccordion("hours")}
        >
          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center">
                <ChevronRight
                  className={`mr-3 text-slate-400 transition-transform duration-200 h-4 w-4 ${
                    openAccordions.has("hours") ? "rotate-90" : ""
                  }`}
                />
                <span className="font-semibold text-slate-800 text-lg">
                  Business Hours
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6">
              <div className="space-y-3">
                {businessData.businessHours.map((schedule, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-2 ${
                      index < businessData.businessHours.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <span className="font-medium text-slate-800">
                      {schedule.day}
                    </span>
                    <span className="text-slate-600">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Social Media */}
        <Collapsible
          open={openAccordions.has("social")}
          onOpenChange={() => toggleAccordion("social")}
        >
          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center">
                <ChevronRight
                  className={`mr-3 text-slate-400 transition-transform duration-200 h-4 w-4 ${
                    openAccordions.has("social") ? "rotate-90" : ""
                  }`}
                />
                <span className="font-semibold text-slate-800 text-lg">
                  Social Media
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                {businessData.socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center p-4 rounded-xl ${social.hoverColor} transition-all duration-200 group`}
                  >
                    <div
                      className={`${social.color} mr-3 group-hover:scale-110 transition-transform duration-200`}
                    >
                      {getSocialIcon(social.icon)}
                    </div>
                    <span className="font-medium text-slate-800">
                      {social.platform}
                    </span>
                  </a>
                ))}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </>
  );
}
