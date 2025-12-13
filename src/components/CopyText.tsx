import { useState } from "react";

export const CopyTextComponent = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const landingPageUrl = `${process.env.NEXT_PUBLIC_WEB_URL || "localhost:3000"}/booking/${text}`
  const bookingLink = `${landingPageUrl}/booking-wizard`;

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
  };

  return (
    <>
    <div className="flex items-center justify-between p-4 border rounded shadow-md">
      <p className="text-sm">
        Landing Page URL:{" "}
        <span className="rounded px-4 py-1">{landingPageUrl}</span>
      </p>
      <button
        onClick={() => handleCopy(landingPageUrl)}
        className="bg-blue-500 text-sm text-white py-1 px-2 rounded hover:bg-blue-700"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
    <div className="flex items-center justify-between p-4 border rounded shadow-md">
      <p className="text-sm">
        Booking Wizard URL:{" "}
        <span className="rounded px-4 py-1">{bookingLink}</span>
      </p>
      <button
        onClick={() => handleCopy(bookingLink)}
        className="bg-blue-500 text-sm text-white py-1 px-2 rounded hover:bg-blue-700"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
    </>
  );
};
