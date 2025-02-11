"use client";

import { useSearchParams } from "next/navigation";

export default function Contact() {
  const searchParams = useSearchParams();

  const primaryContatctId = searchParams.get("primaryContatctId");
  const emails = searchParams.get("emails")?.split(",");
  const phoneNumbers = searchParams.get("phoneNumbers")?.split(",");
  const secondaryContactIds = searchParams.get("secondaryContactIds")?.split(",").map(Number); // Convert to numbers

  if (!primaryContatctId) {
    return <div>No contact information found.</div>; // Handle missing data
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-zinc-800">
      <div className="max-w-md mx-auto p-6 bg-zinc-200 shadow-md rounded-lg">
        <h2 className="text-xl text-black font-semibold mb-2">Contact Information</h2>
        <p className="text-zinc-500">
          <strong className="text-zinc-800">Primary Contact ID:</strong> {primaryContatctId}
        </p>
        <p className="text-zinc-500">
          <strong className="text-zinc-800">Emails:</strong> {emails?.join(", ") || "N/A"} {/* Handle potential nulls */}
        </p>
        <p className="text-zinc-500">
          <strong className="text-zinc-800">Phone Numbers:</strong> {phoneNumbers?.join(", ") || "N/A"}
        </p>
        <p className="text-zinc-500">
          <strong className="text-zinc-800">Secondary Contact IDs:</strong> {secondaryContactIds?.join(", ") || "N/A"}
        </p>
      </div>
    </div>
  );
}