"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organizationName: "",
  organizationSize: "",
  teamChallenges: "",
};

export default function WaitlistForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("You're on the list!");
        setFormData(INITIAL_FORM_STATE);
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
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto text-left">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className="px-6 py-4 bg-background/50 border border-primary/30 rounded-lg text-textPrimary placeholder-textMuted/50 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className="px-6 py-4 bg-background/50 border border-primary/30 rounded-lg text-textPrimary placeholder-textMuted/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Work email"
                  required
                  className="px-6 py-4 bg-background/50 border border-primary/30 rounded-lg text-textPrimary placeholder-textMuted/50 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="px-6 py-4 bg-background/50 border border-primary/30 rounded-lg text-textPrimary placeholder-textMuted/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="Organization name"
                  className="px-6 py-4 bg-background/50 border border-primary/30 rounded-lg text-textPrimary placeholder-textMuted/50 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="text"
                  name="organizationSize"
                  value={formData.organizationSize}
                  onChange={handleChange}
                  placeholder="Organization size (e.g. 25 engineers)"
                  className="px-6 py-4 bg-background/50 border border-primary/30 rounded-lg text-textPrimary placeholder-textMuted/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <textarea
                name="teamChallenges"
                value={formData.teamChallenges}
                onChange={handleChange}
                placeholder="What problems is your team currently facing?"
                rows={4}
                className="w-full px-6 py-4 bg-background/50 border border-primary/30 rounded-lg text-textPrimary placeholder-textMuted/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50"
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
