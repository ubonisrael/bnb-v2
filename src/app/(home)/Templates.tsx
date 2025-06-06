import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface TemplateCardProps {
  title: string;
  description: string;
  imageSrc: string;
  category: string;
  delay: number;
  link: string;
}

const TemplateCard = ({
  title,
  description,
  imageSrc,
  category,
  delay,
  link,
}: TemplateCardProps) => {
  return (
    <div
      className="rounded-xl overflow-hidden border border-border bg-card shadow-soft opacity-0 animate-fade-up transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] relative"
      style={{ animationDelay: `${delay}s` }}
    >
      {!link && (
        <div className="absolute inset-0 bg-black/25 z-30 flex items-center justify-center">
          <span className="text-white font-medium">Coming Soon</span>
        </div>
      )}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out transform hover:scale-105"
          style={{ backgroundImage: `url(${imageSrc})` }}
        ></div>
        <div className="absolute top-3 left-3 z-20">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
            {category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Link
          href={link}
          className="flex items-center bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-md px-4 py-2 transition-colors duration-200 border"
          // className="w-full justify-between items-center"
        >
          Use This Template
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const Templates = () => {
  const templates = [
    {
      title: "Appointment Scheduler",
      description:
        "Perfect for service professionals like consultants and coaches.",
      imageSrc:
        "https://images.unsplash.com/photo-1596079890744-c1a0462d0975?auto=format&fit=crop&q=80&w=800",
      category: "Services",
      delay: 0.1,
      link: "/auth/register",
    },
    {
      title: "Event Registration",
      description:
        "Ideal for workshops, webinars, and conferences with multiple sessions.",
      imageSrc:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
      category: "Events",
      delay: 0.2,
      link: "",
    },
    {
      title: "Resource Booking",
      description:
        "Great for room reservations, equipment rentals, and facilities.",
      imageSrc:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      category: "Resources",
      delay: 0.3,
      link: "",
    },
  ];

  return (
    <section id="templates" className="section-container animate-fade-up">
      <h2 className="section-title">
        Featured <span className="text-brand-500">Templates</span>
      </h2>
      <p className="section-subtitle">
        Get started quickly with our professionally designed booking templates.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {templates.map((template, index) => (
          <TemplateCard
            key={index}
            title={template.title}
            description={template.description}
            imageSrc={template.imageSrc}
            category={template.category}
            delay={template.delay}
            link={template.link}
          />
        ))}
      </div>

      {/* <div className="mt-16 text-center">
        <Button className="bg-brand-500 hover:bg-brand-600 text-white">
          <a href="#get-started" className="flex items-center">
            Explore All Templates
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div> */}
    </section>
  );
};

export default Templates;
