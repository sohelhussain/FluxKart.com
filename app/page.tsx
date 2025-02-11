"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import the router

export default function Home() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize the router
  const [response, setResponse] = useState<{ primaryContatctId: string, emails: string[], phoneNumbers: string[], secondaryContactIds: string[] } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post("/api/v1/identify", { email, phoneNumber }) as { data: { contact: { primaryContatctId: string, emails: string[], phoneNumbers: string[], secondaryContactIds: string[] } } };
      setResponse(res.data.contact); // Set the response data
      // Redirect to the contact info page, passing data as query parameters
      router.push(`/contact?primaryContatctId=${res.data.contact.primaryContatctId}&emails=${res.data.contact.emails.join(",")}&phoneNumbers=${res.data.contact.phoneNumbers.join(",")}&secondaryContactIds=${res.data.contact.secondaryContactIds.join(",")}`);

    } catch (err: any) {
      console.log(err);
      // if (axios.isAxiosError(err)) {
      //   setError(err.response?.data?.error || "An error occurred");
      //   console.error("Axios Error:", err.response?.data || err.message);
      // } else {
      //   setError("An unexpected error occurred");
      //   console.error("Unexpected Error:", err);
      // }
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-zinc-800">
      <div className="max-w-md mx-auto p-6 bg-zinc-200 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-zinc-500">Identify Contact</h1>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-zinc-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-zinc-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-700 text-white py-2 px-4 rounded-md hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            Submit
          </button>

        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {response && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-xl text-black font-semibold mb-2">Contact Information</h2>
            <p className="text-zinc-500">
              <strong className="text-zinc-800">Primary Contact ID:</strong> {response.primaryContatctId}
            </p>
            <p className="text-zinc-500">
              <strong className="text-zinc-800">Emails:</strong> {response.emails.join(", ")}
            </p>
            <p className="text-zinc-500">
              <strong className="text-zinc-800">Phone Numbers:</strong> {response.phoneNumbers.join(", ")}
            </p>
            <p className="text-zinc-500">
              <strong className="text-zinc-800">Secondary Contact IDs:</strong> {response.secondaryContactIds.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}