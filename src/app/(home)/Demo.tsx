"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Demo = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const services = [
    {
      id: "consultation",
      name: "Initial Consultation",
      duration: "30 min",
      price: "Free"
    },
    {
      id: "strategy",
      name: "Strategy Session",
      duration: "60 min",
      price: "$99"
    },
    {
      id: "workshop",
      name: "Group Workshop",
      duration: "120 min",
      price: "$149"
    }
  ];

  const dates = ["Mon, Jun 10", "Tue, Jun 11", "Wed, Jun 12", "Thu, Jun 13", "Fri, Jun 14"];
  const times = ["9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const resetDemo = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <section id="demo" className="section-container bg-brand-50/50 rounded-xl overflow-hidden shadow-soft animate-fade-up">

      <h2 className="section-title text-center">See it in <span className="text-brand-500">Action</span></h2>
      <p className="section-subtitle text-center">Try our interactive demo to experience how simple booking can be.</p>

      <div className="max-w-4xl mx-auto mt-12 rounded-xl overflow-hidden shadow-soft bg-white border border-border opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="border-b border-border p-4 flex justify-between items-center bg-white">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-muted-foreground">Demo Booking Process</span>
          </div>
          <div></div>
        </div>

        <div className="p-4 bg-white">
          <div className="flex overflow-hidden mb-6 rounded-lg bg-muted">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={cn(
                  "flex-1 py-3 text-center text-xs font-medium transition-all",
                  step >= stepNumber
                    ? "bg-brand-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                Step {stepNumber}
              </div>
            ))}
          </div>

          <div className="min-h-[400px] flex flex-col justify-between">
            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-brand-500" />
                  Select a Service
                </h3>
                <div className="grid gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={cn(
                        "p-4 rounded-lg border border-border cursor-pointer transition-all hover:border-brand-300 hover:shadow-sm",
                        selectedService === service.id && "border-brand-500 bg-brand-50"
                      )}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.duration}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{service.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-brand-500" />
                  Select a Date
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {dates.map((date) => (
                    <div
                      key={date}
                      className={cn(
                        "p-3 rounded-lg border border-border text-center cursor-pointer transition-all hover:border-brand-300 hover:shadow-sm",
                        selectedDate === date && "border-brand-500 bg-brand-50"
                      )}
                      onClick={() => handleDateSelect(date)}
                    >
                      <span className="font-medium">{date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-brand-500" />
                  Select a Time
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {times.map((time) => (
                    <div
                      key={time}
                      className={cn(
                        "p-3 rounded-lg border border-border text-center cursor-pointer transition-all hover:border-brand-300 hover:shadow-sm",
                        selectedTime === time && "border-brand-500 bg-brand-50"
                      )}
                      onClick={() => handleTimeSelect(time)}
                    >
                      <span className="font-medium">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-brand-500" />
                  Booking Confirmed
                </h3>
                <div className="bg-brand-50 rounded-lg p-6 border border-brand-100 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
                      <span className="text-2xl">✓</span>
                    </div>
                  </div>
                  <h4 className="text-center font-medium text-lg mb-4">Your booking is confirmed!</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{services.find(s => s.id === selectedService)?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg p-4 border border-yellow-200 bg-yellow-50 flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700">A confirmation email has been sent to your inbox with all the details.</p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                >
                  Back
                </Button>
              )}

              {step === 4 ? (
                <Button
                  className="ml-auto bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={resetDemo}
                >
                  Try Again
                </Button>
              ) : (
                <div className={cn(step === 1 && "ml-auto")}>
                  {step < 4 && (
                    <Button
                      className="bg-brand-500 hover:bg-brand-600 text-white"
                      onClick={() => {
                        if (
                          (step === 1 && selectedService) ||
                          (step === 2 && selectedDate) ||
                          (step === 3 && selectedTime)
                        ) {
                          setStep(step + 1);
                        }
                      }}
                      disabled={
                        (step === 1 && !selectedService) ||
                        (step === 2 && !selectedDate) ||
                        (step === 3 && !selectedTime)
                      }
                    >
                      Continue
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default Demo;
