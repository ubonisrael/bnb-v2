// Function to get time slot index
  export const getTimeSlotIndex = (time: string, slots: string[]) => {
    return slots.findIndex((slot) => slot === time);
  };

  export const getAppointmentColor = (() => {
    const colors = [
      "bg-[hsl(var(--appointment-blue))]",
      "bg-[hsl(var(--appointment-pink))]",
      "bg-[hsl(var(--appointment-teal))]",
      "bg-[hsl(var(--appointment-orange))]",
      "bg-[hsl(var(--appointment-purple))]",
      "bg-[hsl(var(--appointment-green))]",
      "bg-[hsl(var(--appointment-red))]",
      "bg-[hsl(var(--appointment-yellow))]",
      "bg-[hsl(var(--appointment-indigo))]",
      "bg-[hsl(var(--appointment-cyan))]",
    ];
    let usedColors: string[] = [];
    let lastUsedColor: string | null = null;

    return () => {
      if (usedColors.length === colors.length) {
        // Get all colors except the last used one
        const availableColors = colors.filter(
          (color) => color !== lastUsedColor
        );
        // Select a random color from available colors
        const selectedColor =
          availableColors[Math.floor(Math.random() * availableColors.length)];
        // Reset usedColors with only the new selected color
        usedColors = [selectedColor];
        lastUsedColor = selectedColor;
        return selectedColor;
      }

      const availableColors = colors.filter(
        (color) => !usedColors.includes(color)
      );
      const selectedColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      usedColors.push(selectedColor);
      lastUsedColor = selectedColor;

      return selectedColor;
    };
  })();

// Time slots for the calendar
// Example usage:
// const timeSlots = generateTimeSlots(420, 1380, 60); // 7:00 to 23:00, hourly intervals
export const generateTimeSlots = (
  start: number,
  end: number,
  interval: number
): string[] => {
  const slots: string[] = [];
  for (let i = start; i <= end; i += interval) {
    const hours = Math.floor(i / 60);
    const minutes = i % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  }
  return slots;
};

export const heightOfCalendarRow = 32; // Height of each row in the calendar (in pixels)
