"use client";

import { useLayoutEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface AutoResizeDescriptionProps {
  value: string;
  label: string;
  className?: string;
}

export function AutoResizeDescription({
  value,
  label,
  className,
}: AutoResizeDescriptionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    resize();

    const observer = new ResizeObserver(resize);
    if (textarea.parentElement) observer.observe(textarea.parentElement);

    return () => observer.disconnect();
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      aria-label={label}
      readOnly
      className={className}
      value={value}
    />
  );
}
