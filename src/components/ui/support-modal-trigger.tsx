import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { Button } from "@/components/ui/button";
import { SupportModal } from "@/components/ui/support-modal";
import { MessageCircle, MoreVertical, Hand } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Position = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export function SupportModalTrigger() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>("bottom-right");
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getPositionStyles = (pos: Position) => {
    switch (pos) {
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-right":
        return "top-16 right-4";
      case "top-left":
        return "top-16 left-4";
    }
  };

  const handleButtonClick = () => {
    if (!isDragging) {
      setOpen(true);
    }
  };

  return (
    <>
      <Draggable
        nodeRef={ref}
        handle=".drag-handle"
        bounds="body"
        onStart={() => setIsDragging(false)}
        onDrag={() => setIsDragging(true)}
        onStop={() => {
          setTimeout(() => setIsDragging(false), 0);
        }}
      >
        <div
          ref={ref}
          className={`fixed ${getPositionStyles(
            position
          )} z-50 flex items-center gap-2`}
        >
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPosition("top-left")}>
                  Move to Top Left
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPosition("top-right")}>
                  Move to Top Right
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPosition("bottom-left")}>
                  Move to Bottom Left
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPosition("bottom-right")}>
                  Move to Bottom Right
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handleButtonClick}
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out">
                Contact Support
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="drag-handle h-8 w-8 cursor-move"
            >
              <Hand className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Draggable>

      <SupportModal open={open} onOpenChange={setOpen} />
    </>
  );
}
