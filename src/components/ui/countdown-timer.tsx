import { useEffect, useState } from "react";
import dayjs from "@/utils/dayjsConfig";

interface CountdownTimerProps {
  targetDate: dayjs.Dayjs;
  onExpire?: () => void;
}

// Pad numbers with leading zeros
const padNumber = (num: number): string => {
  return num.toString().padStart(2, "0");
};

export function CountdownTimer({ targetDate, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const diffInMinutes = targetDate.diff(now, "minute");
      const diffInSeconds = targetDate.diff(now, "second");

      if (diffInSeconds <= 0) {
        // Check against seconds for more precise expiration
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onExpire?.();
        return;
      }

      const days = Math.floor(diffInMinutes / (24 * 60));
      const hours = Math.floor((diffInMinutes % (24 * 60)) / 60);
      const minutes = diffInMinutes % 60;
      const seconds = diffInSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Initial calculation
    calculateTimeLeft();

    // Update every second using setInterval
    const timerId = setInterval(() => {
      calculateTimeLeft();
    }, 1000); // Update every 1 second for more precise countdown

    // Cleanup function to clear the interval when the component unmounts
    // or when dependencies change (targetDate or onExpire)
    return () => clearInterval(timerId);
  }, [targetDate, onExpire]);

  return (
    <div
      className={`font-mono ${isExpired ? "text-red-600" : "text-blue-600"} text-lg`}
    >
      {isExpired ? (
        <div className="flex flex-col items-center">
          <span className="font-semibold text-center">Time Expired</span>
          <div>
            {padNumber(timeLeft.days)}d {padNumber(timeLeft.hours)}h{" "}
            {padNumber(timeLeft.minutes)}m {padNumber(timeLeft.seconds)}s
          </div>
        </div>
      ) : (
        <span>
          {padNumber(timeLeft.days)}d {padNumber(timeLeft.hours)}h{" "}
          {padNumber(timeLeft.minutes)}m {padNumber(timeLeft.seconds)}s
        </span>
      )}
    </div>
  );
}
