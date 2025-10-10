"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function WaitlistForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("You're on the list!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to submit. Please try again.");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <section
      id="waitlist"
      ref={ref}
      className="py-24 px-6 bg-gradient-to-b from-background to-primary/5"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="relative bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-3xl p-12 shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl blur-xl" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-textPrimary mb-4">
              Be among the first to experience Celer.
            </h2>
            <p className="text-xl text-textMuted mb-8">
              Our MVP launches soon — join the waitlist for early access.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 bg-background/50 border border-primary/30 rounded-lg text-textPrimary placeholder-textMuted/50 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50"
              >
                {status === "loading" ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-lg ${status === "success" ? "text-green-400" : "text-red-400"}`}
              >
                {message}
              </motion.p>
            )}
            <p className="text-sm text-textMuted/70 mt-6">We respect your inbox.</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
