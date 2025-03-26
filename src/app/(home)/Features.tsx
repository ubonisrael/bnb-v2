"use client";
import { Calendar, Layers, Settings, Users, Layout, Shield } from "lucide-react";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="feature-card opacity-0 animate-fade-up">
      <div className="mb-5 text-brand-500">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Customizable Templates",
      description: "Choose from a variety of pre-built templates or create your own from scratch.",
      delay: 0.1
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Flexible Scheduling",
      description: "Set custom availability, buffer times, and booking windows for your services.",
      delay: 0.2
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Multi-User Support",
      description: "Manage bookings for multiple team members with different schedules.",
      delay: 0.3
    },
    {
      icon: <Layout className="h-8 w-8" />,
      title: "Branded Experience",
      description: "Customize every aspect of your booking portal to match your brand identity.",
      delay: 0.4
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Integration Ready",
      description: "Connect seamlessly with your favorite calendars, payment systems, and CRMs.",
      delay: 0.5
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and reliability for your booking processes.",
      delay: 0.6
    }
  ];

  return (
    <section id="features" className="section-container ">
      <h2 className="section-title">Powerful <span className="text-brand-500">Features</span></h2>
      <p className="section-subtitle">Everything you need to create the perfect booking experience for your customers.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {features.map((feature, index) => (
          <div key={index} style={{ animationDelay: `${feature.delay}s` }}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
