import { useLocation } from "wouter";

export default function Hero() {
  const [, navigate] = useLocation();

  return (
    <section className="w-full py-20 text-center">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6">
          AI-Powered Identity Security
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Visualize, simulate, and secure your identity attack surface in real time.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/demo/dashboard")}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Live Demo
          </button>

          <button
            onClick={() => navigate("/pricing")}
            className="px-6 py-3 border rounded-lg"
          >
            View Pricing
          </button>
        </div>
      </div>
    </section>
  );
}