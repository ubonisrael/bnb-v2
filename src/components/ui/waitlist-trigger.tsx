import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { WaitlistModal } from "./waitlist-modal";

interface WaitlistModalProps {
  url: string;
  selectedDate: string;
  selectedServices: { id: string | number; name: string }[];
  totalDuration: number;
}

export const WaitlistTrigger = ({
  url,
  selectedDate,
  selectedServices,
  totalDuration,
}: WaitlistModalProps) => {
  const [mode, setMode] = useState<TimeSelectionMode>("single");
  const [showModal, setShowModal] = useState(false);

  return (
    <Dialog
      onOpenChange={() => {
        // reset mode to single when dialog is opened or closed
        setMode("single");
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="w-full gap-2 rounded-md mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12"
        >
          <Clock className="h-4 w-4" />
          Did not find a suitable time?{" "}
          <span className="">
            Join a waitlist and when a spot opens up you will be notified.
          </span>
        </Button>
      </DialogTrigger>
      {showModal && (
        <WaitlistModal
          mode={mode}
          setMode={setMode}
          setShowModal={setShowModal}
          selectedDate={selectedDate}
          selectedServices={selectedServices}
          totalDuration={totalDuration}
          url={url}
        />
      )}
    </Dialog>
  );
};
