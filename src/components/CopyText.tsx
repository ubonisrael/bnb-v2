import { useState } from "react";

export const CopyTextComponent = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(
        `${process.env.NEXT_PUBLIC_WEB_URL || "localhost:3000"}/booking/${text}`
      )
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded shadow-md">
      <p className="text-sm">
        Booking Link:{" "}
        <span className="rounded px-4 py-1">{`${
          process.env.NEXT_PUBLIC_WEB_URL || "localhost:3000"
        }/booking/${text}`}</span>
      </p>
      <button
        onClick={handleCopy}
        className="bg-blue-500 text-sm text-white py-1 px-2 rounded hover:bg-blue-700"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};
