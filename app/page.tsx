import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Authentication System
        </h1>

        <p className="text-gray-600 mb-6">
          Next.js Final Exam Project
        </p>

        <Link
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}