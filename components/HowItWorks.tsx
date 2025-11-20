"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const steps = [
  {
    number: "1",
    title: "Pull Data",
    description: "Auto-fetch omics datasets from every public repository in the world (GEO, PRIDE, or uploads).",
  },
  {
    number: "2",
    title: "Format Data",
    description: "Formats data into a universal format for any omics analysis tool",
  },
  {
    number: "3",
    title: "Analyze Data",
    description: "Agentic AI runs explainable analysis: proteomics, transcriptomics, metabolomics.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section id="how-it-works" ref={ref} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-textPrimary text-center mb-16"
        >
          How It Works
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 transition-all duration-500 ${
                activeStep === index ? "shadow-lg shadow-primary/30 border-primary/50" : ""
              }`}
            >
              <div className="text-6xl font-extrabold text-primary/30 mb-4">{step.number}</div>
              <h3 className="text-2xl font-bold text-textPrimary mb-3">{step.title}</h3>
              <p className="text-textMuted leading-relaxed">{step.description}</p>
              
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeStep === index ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
