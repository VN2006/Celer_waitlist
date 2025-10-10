"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function MissionVision() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-gradient-to-b from-background/50 to-background">
      <div className="max-w-6xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 50, filter: "blur(10px)" }
          }
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-primary mb-4">Mission</h3>
          <p className="text-xl text-textMuted leading-relaxed">
            "To accelerate biological discovery by removing friction from data transformation and empowering
            researchers with intelligent, interpretable, and customizable agentic workflows."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 50, filter: "blur(10px)" }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-3xl font-bold text-primary mb-4">Vision</h3>
          <p className="text-xl text-textMuted leading-relaxed">
            "To become the operating system for biological data — a voice-driven AI assistant in every lab
            enabling faster, better, and more accessible scientific breakthroughs."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
