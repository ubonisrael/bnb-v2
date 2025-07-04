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
        setShowModal((prev) => !prev);
        // reset mode to single when dialog is opened or closed
        setMode("single");
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-md">
          <Clock className="h-4 w-4" />
          <span className="">Join Waitlist</span>
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
