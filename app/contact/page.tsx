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
     
    </div>
  );
}